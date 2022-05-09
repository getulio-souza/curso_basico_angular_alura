import { map } from 'rxjs/operators';
import { DateService } from './../../services/date/date.service';
import { DataService, TraceType } from './../../services/data/data.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StructureService } from '@alis/tracking-ng';
import { PropertyDataLoader } from '../propertyDataLoader';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '@alis/ng-services';
import { forkJoin } from 'rxjs';
import { RealTime } from '../../abstracts/realTime';
import { NumericRoundService, RoundValueInfo } from '../../services/numericRound/numeric-round.service';

@Component({
  selector: 'home-property-summary',
  templateUrl: './property-summary.component.html',
  styleUrls: ['./property-summary.component.less']
})
export class PropertySummaryComponent extends PropertyDataLoader implements OnInit, OnDestroy {


  @Input() complete;
  @Input() structure;
  @Input() properties;
  @Input() propertyId;

  temperatureUomIsFahrenheit;
  showDndBars;
  showConsumptionSummaryData;
  showOccupancyBars;
  showSoldBars;
  
  realTime: RealTime;
  
  oneHourAgo = this.dateService.getOneHourBefore();
  endDate = this.dateService.getCurrentTime();

  generalSummary = {
    occupancyNAPercent: 100,
    soldNAPercent: 100,
    dndNAPercent: 100
  };
  hideGridColumns;

  // show subdivision details
  showSubdivisionDetails = false;

  // subdivision summaries
  subdivisionSummaries: Array<any>;
  subdivisionIndexPositionMap = {};

  // the currently selected subdivision
  selectedSubdivision;

  // last selected subdivision
  // - used to make a beautiful transition between two datas
  lastSelectedSubdivision;

  subdivisionIds = new Set;
  subdivisionLevel;

  structureFiltered;

  lastClickedUnit;
  showUnitDetails;
  
  roundValueInfo: RoundValueInfo = {
    divideBy: 1000,
    uom: "kWh"
  };

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private numericRoundService: NumericRoundService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    translateService: TranslateService
  ) {
    super(translateService, structureService, propertiesService);
   
    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });
 
  }


  /**
   * Things that should be done only after
   * property has been loaded
   */
  afterPropertyHasBeenLoaded() {
    // retrieves config that specifies how we should subdivide property
    // - this means that each row in the summary list should be an entity of a specified level
    // - common case is to use level 1: level 0 is the simplest unit, normally a "room" or "apartment", while level 1 is usually a "floor"
    if (!this.properties.propertySubdivision) {
      console.info('Could not find propertySubdivision property, lets use level 1 as default');
      this.subdivisionLevel = 1;
    } else {
      this.subdivisionLevel = this.properties.propertySubdivision.level;
    }
    
    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    let propertySummaryConfig = this.properties.propertySummary;

    if (propertySummaryConfig) {
      this.showDndBars = propertySummaryConfig.showDndBars;
      this.showConsumptionSummaryData = propertySummaryConfig.showConsumptionSummaryData;
      this.showOccupancyBars = propertySummaryConfig.showOccupancyBars;
      this.showSoldBars = propertySummaryConfig.showSoldBars;

      // the default is to show consumptionDataSummary
      if(this.showConsumptionSummaryData == null){
        this.showConsumptionSummaryData = true;
      }
      // the default is to show showOccupancyBars
      if(this.showOccupancyBars == null){
        this.showOccupancyBars = true;
      }
      // the default is to show showSoldBars
      if(this.showSoldBars == null){
        this.showSoldBars = true;
      }

      let roundValueInfo = propertySummaryConfig.roundValueInfo;
      if(roundValueInfo){
        this.roundValueInfo = roundValueInfo;
      }
    } else {

      //if there is no property summary config
      //lets use as default the following configuration
      this.showConsumptionSummaryData = true;
      this.showOccupancyBars = true;
      this.showSoldBars = true;
    }

    this.realTime = new RealTime();
    this.subdivisionSummaries = [];
    this.structureFiltered = this.structure;

    this.realTime.startGettingRealTimeData(() => {
      this.buildSummaries();
    });
  }

  onChangeStructureFilter(filteredStructure){
    this.structureFiltered = filteredStructure;
    this.subdivisionIds = this.structureService.getAllStructIdsByGivenStructureAndLevel(filteredStructure, this.subdivisionLevel)
    this.buildSummaries();
  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }
  }


  /**
   * Builds a summary based on the provided structure (can be the whole property or a subdivision)
   */
  buildStructureSummary(structure, summary, forceRequest) {
    

 
    // lets property summary (sold,occupancy,consumption)
    return this.getEmsSummarysAndDndTkoLastTrace(this.propertyId, structure.id, this.oneHourAgo, this.endDate, forceRequest).pipe(map((allTracesAggregations) => {

      // first position is the ems aggregation
      const emsAggregation = allTracesAggregations[0];
      
      // second is the property unit

      const propertyUnit = allTracesAggregations[1];

      // retrieves ids for rooms/apartments (level 0)
      const ids = this.structureService.getAllStructIdsByGivenStructureAndLevel(structure, 0);

      return this.buildDataSummary(summary, emsAggregation, propertyUnit, ids);
    }));
  }

  ngOnInit() {
    // initializing
    this.generalSummary['sold'] = 0;
    this.generalSummary['occupancy'] = 0;
    // FIXME: NOT setting consumption and totalRooms to 0 by default
    // - when request is cached, for some reason angular is not understanding when these two fields change "quicky" (only these two!)
    // - if we don't set them, angular picks them up when they are filled in
    this.generalSummary['consumption'];
    this.generalSummary['totalRooms'];

  }

  /**
   * Builds subdivision (floor) summaries and IndexPositionMap
   * 
   * @param subdivisionIds the ids in the general structure that should be used to build the data
   */
  buildSubdivisionSummaries(subdivisionIds) {

    this.subdivisionIndexPositionMap = {};
    this.subdivisionSummaries = [];

    // prepares summaries (id is ordered from structure)
    let subdivisionIndex = 0;
    subdivisionIds.forEach(subdivisionId => {
      // let's prepare summaries array adding structure, name, id and shortname

      if (this.subdivisionIndexPositionMap[subdivisionId] != null) {
        // subdivision summary has already been created, not necessary to prepare this floor
        return;
      }

      const subdivisionStructure = this.structureService.getStructureByGivenStructureId(this.structure, subdivisionId);
      const subdivisionSummary = {};
      subdivisionSummary['structure'] = subdivisionStructure;
      subdivisionSummary['name'] = subdivisionStructure['name'];
      subdivisionSummary['shortName'] = subdivisionStructure['shortName'];
      subdivisionSummary['id'] = this.propertyId + '.' + subdivisionStructure['id'];
      subdivisionSummary['structureId'] = subdivisionStructure['id'];

      subdivisionSummary['occupancyNAPercent'] = 100;
      subdivisionSummary['soldNAPercent'] = 100;
      subdivisionSummary['dndNAPercent'] = 100;

      this.subdivisionIndexPositionMap[subdivisionId] = subdivisionIndex;
      this.subdivisionSummaries[subdivisionIndex] = subdivisionSummary;
      subdivisionIndex++;
    });

    // fills in summary data
    subdivisionIds.forEach(subdivisionId => {
      this.updateSubdivisionData(subdivisionId, false);
    });
    
  }

  buildSummaries() {
    
    //if null means
    // onChange from unit filter has not been triggered yet
    if(this.structureFiltered == null) {return ;}


    this.buildStructureSummary(this.structureFiltered, this.generalSummary, false).subscribe(summary => this.generalSummary = summary);
    this.buildSubdivisionSummaries(this.subdivisionIds);
 }

  /**
   * Updates data for a given subdivision (floor) summary
   * 
   * @param subdivisionId the id that identifies the subdivision in the general property structure
   */
  updateSubdivisionData(subdivisionId, forceRequest) {

    let index = this.subdivisionIndexPositionMap[subdivisionId];
    let summary = this.subdivisionSummaries[index];

    this.buildStructureSummary(summary['structure'], summary, forceRequest).subscribe(summary => {
      if (this.selectedSubdivision && this.selectedSubdivision.id == summary.id) {
        //we are updating
        this.selectedSubdivision = summary;
      }
      this.subdivisionSummaries[index] = summary;
    });
  }

 
  /**
   * Gets ems, dnd and thermostat last trace
   * @param propertyId the property id
   * @param tag tag
   * @param startDate startDate in ms
   * @param endDate endDate in ms
   * @param forceRequest if true, will request data even having a valid cache
   */
  getEmsSummarysAndDndTkoLastTrace(propertyId, tag, startDate, endDate, forceRequest) {
    //gets 
    // 1- ems aggregation to get kwh (last hour)
    // 2- dnd last traces
    // 3- tkoLastTrace
    let body = {};
    body['kwh'] = 'SUM';
    const emsAggregation = this.dataService.latestTraceByTypeOwnerAndTag(TraceType.EMS, propertyId, tag, body, null, forceRequest).pipe(map(res => res));

       
    body['dndState'] = 'ENUM';
    body['presence'] = 'ENUM';
    body['pmsState'] = 'ENUM';
    const propertyUnit = this.dataService.latestTraceByTypeOwnerAndTag(TraceType.UNIT, this.propertyId, tag, body, null, forceRequest).pipe(map(res => res))


    return forkJoin([emsAggregation, propertyUnit]).pipe(map(results => {
      return results;
    }));

  }


  /**
   * When a subdivision/floor dot is clicked in the dot buttons it builds corresponding subdivision summary
   */
  onDotSubdivisionClick(summary) {
    this.showSubdivisionDetails = true;

    this.lastSelectedSubdivision = this.selectedSubdivision;
    // only to show correct bars movement
    this.selectedSubdivision = this.copyOldSubdivisionSummaryData(this.lastSelectedSubdivision, summary);
    this.startGettingSubdivisionData(summary);
  }

  /**
   * Activated when a subdivision/floor card whas clicked
   * @param summary the subdivision summary
   */
  onCardSummaryClick(summary) {

    // if room ids has not been load, dont go to floor details page
    if (!(summary.roomsIds)) {
      return;
    }

    this.showSubdivisionDetails = true;
    this.lastSelectedSubdivision = summary;
    this.selectedSubdivision = summary;
    this.startGettingSubdivisionData(summary);
  }

  /**
   * start getting subdivision/floor data (occupancy, sold, dnd etc) and roomsInfo for the given summary
   * 
   * @param summary subdivision/floor summary
   */
  startGettingSubdivisionData(summary) {

    // cleanInterval
    clearInterval(this.realTime.interval);

    this.realTime.startGettingRealTimeData(() => {
      // updates data (bars etc)
      this.updateSubdivisionData(summary.structureId, true);
    })

  }

  private buildDataSummary(summary, emsAggregation, propertyUnit, ids) {


    // last-hour tko
    let consumption = 0;

    //real time - tko
    let occupiedPercentage = 0;
    let unOccupiedPercentage = 0;
    let occupancyNaPercentage = 100;

    let soldPercentage = 0;
    let totalSold = 0;
    let unSoldPercentage = 0;
    let soldNaPercentage = 100;

    //dnd
    let dndMakeUpRoomPercentage = 0;
    let dndDndPercentage = 0;
    let dndNonePercentage = 0;
    let dndNAPercentage = 100;

    if (emsAggregation) {
      //last hour aggregation, so we dont need to worry about 'last updated'
      consumption = emsAggregation.kwh * 1000;
    }

    if (propertyUnit) {
      const total = propertyUnit.total;
      if (propertyUnit.date < this.oneHourAgo) {
        //less than one hour, lets consider occupancy,sold and dnd NA as 100%
      } else {
        if (total != null && total != 0) {
          const state = propertyUnit.dndState;
          if (state) {
            const totalDndMakeUpRoomPercentage = state['make-up-room'] != null ? state['make-up-room'] : 0;
            const totalDndDndPercentage = state['do-not-disturb'] != null ? state['do-not-disturb'] : 0;
            const totalDndNonePercentage = state['none'] != null ? state['none'] : 0;
            const totalNa = total - totalDndMakeUpRoomPercentage - totalDndDndPercentage - totalDndNonePercentage;

            dndMakeUpRoomPercentage = 100 * (totalDndMakeUpRoomPercentage / total);
            dndDndPercentage = 100 * (totalDndDndPercentage / total);
            dndNonePercentage = 100 * (totalDndNonePercentage / total);
            dndNAPercentage = 100 * (totalNa / total);
          }
        }
      }

    }


    if (propertyUnit) {
      const total = propertyUnit.total;
      if (propertyUnit.date < this.oneHourAgo) {
        //less than one hour, lets consider occupancy,sold and dnd NA as 100%
      } else {
        if (total != null && total != 0) {
          const presence = propertyUnit['presence'];
          const pmsState = propertyUnit['pmsState'];
          if (presence) {
            const totalOccupied = presence['true'] != null ? presence['true'] : 0;
            const totalUnccupied = presence['false'] != null ? presence['false'] : 0;

            occupancyNaPercentage = 100 * (total - totalOccupied - totalUnccupied) / total;
            occupiedPercentage = 100 * (totalOccupied / total);
            unOccupiedPercentage = 100 * (totalUnccupied / total);

          }
          if (pmsState) {
            totalSold = pmsState['sold'] != null ? pmsState['sold'] : 0;
            const totalUnsold = pmsState['unsold'] != null ? pmsState['unsold'] : 0;

            soldNaPercentage = 100 * (total - totalSold - totalUnsold) / total;
            soldPercentage = 100 * (totalSold / total);
            unSoldPercentage = 100 * (totalUnsold / total);
          }
        }
      }

    }

    
    summary['dndMakeUpRoomPercent'] = Math.round(dndMakeUpRoomPercentage);
    summary['dndDndPercent'] = Math.round(dndDndPercentage);
    summary['dndNonePercent'] = Math.round(dndNonePercentage);
    summary['dndNAPercent'] = Math.round(dndNAPercentage);

    summary['soldPercent'] = Math.round(soldPercentage);
    summary['soldTotal'] = totalSold;
    summary['unSoldPercent'] = Math.round(unSoldPercentage);
    summary['soldNAPercent'] = Math.round(soldNaPercentage);

    summary['occupancyPercent'] = Math.round(occupiedPercentage);
    summary['unoccupiedPercent'] = Math.round(unOccupiedPercentage);
    summary['occupancyNAPercent'] = Math.round(occupancyNaPercentage);



    if(isNaN(consumption)){
      consumption = 0;
    }

    if(consumption != null){
      let roundResult = this.numericRoundService.getRoundResult(this.roundValueInfo,consumption);
      summary['consumptionLastHour'] = consumption;
      summary['consumptionLabel'] =roundResult.label;
      summary['consumptionUom'] = roundResult.uom;
      summary['consumptionValue'] = roundResult.value;
    }
    summary['totalRooms'] = ids.size;
    summary['roomsIds'] = ids;

    return summary;
  }

  /**
   * Returns the new summary with the old summary percentage data
   * @param oldSummary old summary
   * @param newSummary new summary
   */
  copyOldSubdivisionSummaryData(oldSummary, newSummary) {
    newSummary['dndMakeUpRoomPercent'] = oldSummary['dndMakeUpRoomPercent'];
    newSummary['dndDndPercent'] = oldSummary['dndDndPercent'];
    newSummary['dndNonePercent'] = oldSummary['dndNonePercent'];
    newSummary['dndNAPercent'] = oldSummary['dndNAPercent'];

    newSummary['soldPercent'] = oldSummary['soldPercent'];
    newSummary['soldTotal'] = oldSummary['soldTotal'];
    newSummary['unSoldPercent'] = oldSummary['unSoldPercent'];
    newSummary['soldNAPercent'] = oldSummary['soldNAPercent'];

    newSummary['occupancyPercent'] = oldSummary['occupancyPercent'];
    newSummary['unoccupiedPercent'] = oldSummary['unoccupiedPercent'];
    newSummary['occupancyNAPercent'] = oldSummary['occupancyNAPercent'];

    return newSummary;
  }

  /**
   * when back button is clicked to return to property summary
   * it stops getting data for a specific floor and
   * and restart getting real time for all floors and property
   */
  backToPropertySummary() {

    if (this.realTime.interval) {
      clearInterval(this.realTime.interval);
    }

    this.subdivisionSummaries = [];
    this.subdivisionIndexPositionMap = {};
    this.realTime.startGettingRealTimeData(() => {
      this.buildSummaries();
    })

    this.showSubdivisionDetails = false;
    this.selectedSubdivision = null;
  }


  onBackRoomDetail() {
    this.lastClickedUnit = null;
    this.showUnitDetails = false;
  }


}
