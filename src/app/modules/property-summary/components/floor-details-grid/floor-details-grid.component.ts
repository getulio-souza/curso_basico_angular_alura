import { DateService } from './../../../../services/date/date.service';
import { DataService, TraceType } from './../../../../services/data/data.service';
import { DndService } from './../../../../services/dndService/dnd-service.service';
import { NumericRoundService } from './../../../../services/numericRound/numeric-round.service';
import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import {StructureService} from '@alis/tracking-ng';
import {BlueprintService} from '@alis/proxper-base';

import {TranslateService} from '@ngx-translate/core';
import {PropertiesService} from '@alis/ng-services';
import {forkJoin} from 'rxjs';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { RealTime } from '../../../../abstracts/realTime';
import { ThermostatService } from '../../../../services/thermostatService/thermostat.service';
import { TraceUtilsService } from '../../../../services/traceUtils/trace-utils.service';
import { UnitDataService } from '../../../../services/unit-data/unit-data.service';


@Component({
  selector: 'home-floor-details-grid',
  templateUrl: './floor-details-grid.component.html',
  styleUrls: ['./floor-details-grid.component.scss']
})
export class FloorDetailsGridComponent extends PropertyDataLoader implements OnInit, OnChanges {

  @Input() selectedFloor;
  @Input() roundValueInfo;
  @Input() structure;
  @Input() propertyId;
  
  @Output() onUnitClickEmitter = new EventEmitter<any>();
  @Output() onBackRoomDetailEmitter = new EventEmitter<any>();
  @Output() onRoomsInfoBuildEmitter = new EventEmitter<any>();
  
  @Input() properties;
  
  
  floorPlans;
  
  realtimeMap = new Map();

  gridColumns;
  isGridColumnsReady;
  hideGridColumns = null;
  showGrid = false;


  roomsInfo: Array<any>;
  roomsInfoMap = {};
  oneHourAgo = this.dateService.getOneHourBefore();
  temperatureUomIsFahrenheit;
  isBlueprintViewSelected;

  blueprints;
  blueprintInfo;
  realTime: RealTime;

  ready = false;
  unitSelected;

  constructor(
    private numericRoundService: NumericRoundService,
    private unitDataService: UnitDataService,
    private dataService: DataService,
    private blueprintService: BlueprintService,
    private dateService: DateService,
    private traceUtilsService: TraceUtilsService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    translateService: TranslateService) {
    super(translateService, structureService, propertiesService);


    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedFloor != null) {
      
      //always start with no unit selected
      this.unitSelected = null;

      if (changes.selectedFloor.currentValue != null) {
        this.roomsInfo = [];
        this.realTime = this.realtimeMap.get(this.selectedFloor.id);
        if (this.realTime) {
          clearInterval(this.realTime.interval);
        }

        this.realtimeMap.forEach(realtime => {
          clearInterval(realtime.interval);
        });


        this.realtimeMap.set(this.selectedFloor.id, new RealTime());

        this.buildFloorDetailsData(this.selectedFloor);
      }
    }
  }

  ngOnInit() {
  }

  afterPropertyHasBeenLoaded() {
    let propertySummaryConfig = this.properties.propertySummary;
    if (propertySummaryConfig != null) {
      let customColumnsConfig = propertySummaryConfig.customColumns;
      if (customColumnsConfig) {
        this.gridColumns = customColumnsConfig;
        this.isGridColumnsReady = true;
        this.updateHiddenColumns();
      }
    }
    
    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.ready = true;
  }

  


 
  buildRoomsInfo(floorSummary, forceRequest) {
    this.roomsInfo = [];

    const roomsInfoData = this.unitDataService.buildRoomsInfos(this.propertyId,floorSummary.roomsIds,this.structure);
    this.roomsInfoMap = roomsInfoData.roomsInfoMap;
    this.roomsInfo = roomsInfoData.roomsInfo;

    // lets get floor tag id to use in the requests
    const floorStructure = floorSummary.structure;
    let floorTagId;
    if (!floorStructure) {
      return;
    }
    floorTagId = floorStructure.id;


    forkJoin([
      this.dataService.getStatesByOwnerAndTagAndTraceType(this.propertyId,floorTagId,TraceType.UNIT),
      this.dataService.getStatesByOwnerAndTagAndTraceType(this.propertyId,floorTagId, TraceType.WATERMETER),
      this.dataService.getStatesByOwnerAndTagAndTraceType(this.propertyId,floorTagId, TraceType.EMS)
    ]).subscribe((traces) => {

      const propertyUnitTraces = traces[0];
      const waterConsumptionCurrentTraces = traces[1];
      const emsMostCurrentTraces = traces[2];

      propertyUnitTraces.forEach(unitTrace => {
        let currentRoomInfo = this.roomsInfoMap[unitTrace['unitName']];
        if(currentRoomInfo != null) {
          currentRoomInfo = this.unitDataService.updateRoomData(currentRoomInfo, unitTrace, this.temperatureUomIsFahrenheit);
        }
      });



      let localRoomsInfoMap;
      // then, lets build most current traces for mudunit traces
      localRoomsInfoMap = this.buildLocalUnitMap(waterConsumptionCurrentTraces);
      localRoomsInfoMap.forEach((units, unitName) => {
        let currentRoomInfo = this.roomsInfoMap[unitName];
        if(currentRoomInfo == null) { return ;}
        currentRoomInfo = this.updateRoomWithWaterMeterData(currentRoomInfo, units);
      });

      //then, lets build most current traces for EMS
      localRoomsInfoMap = this.buildLocalUnitMap(emsMostCurrentTraces);
      localRoomsInfoMap.forEach((units, unitName) => {
        let currentRoomInfo = this.roomsInfoMap[unitName];
        if(currentRoomInfo == null) { return ;}
        currentRoomInfo = this.updateRoomsInfoWithEMSData(currentRoomInfo, units);
      });


      this.updateHiddenColumns();
      //  FIXME: copying the array every time a change happens
      //  we should turn roomsInfo into an Observable so that the other components can pick up changes
      this.roomsInfo = this.roomsInfo.splice(0);
      this.onRoomsInfoBuildEmitter.emit(this.roomsInfo);


  })

  
      
  }


  updateHiddenColumns() {

    // if you want to hide columns without data you must specify 
    // your columns in config. Otherwise component it will use default
    // columns and will not hide any column.

    // this method is called after receving roomsInfo
    // and after getting gridColumns from config
    // we must have both to continue
    if(this.isGridColumnsReady == false || this.roomsInfo == null) {
      return ;
    }

    // lets prepare the hide grid columns array
    this.hideGridColumns = [];
    this.showGrid = true;

    // if there is no gridColumns from config do nothing
    if(this.gridColumns == null){
      return ;
    }


    this.gridColumns.forEach( (gridColumn) => {
      let count = 0;
      this.roomsInfo.forEach(roomInfo => {
        if(roomInfo[gridColumn.field]){
          count++;
        }
      });

      if(count == 0){
        this.hideGridColumns.push(gridColumn.field);
      }

    });
  }

  buildLocalUnitMap(traces) {
    let localUnitMap = new Map();
    if (traces) {
      traces.forEach(trace => {
        let unitName = trace.unitName;
        let roomsInfo = localUnitMap.get(unitName);
        if (roomsInfo == null) {
          roomsInfo = new Array();
        }
        roomsInfo.push(trace);
        localUnitMap.set(unitName, roomsInfo);
      });
    }
    return localUnitMap;
  }




  /**
   * @param roomInfo updates the rooms info with the given traceEMS
   * @param allEmsData all emsData traces
   */
  updateRoomsInfoWithEMSData(roomInfo, allEmsData) {

    // stores information from lat trace

    let totalConsumptionLastHour = 0;
    let mostRecentTimestamp = null;
    allEmsData.forEach(emsData => {
      const timestamp = emsData['timestamp'];
      //if there is data, convert to wh
      let currentConsumption = emsData.kwh ? emsData.kwh * 1000 : 0;
      totalConsumptionLastHour += currentConsumption;

      if (totalConsumptionLastHour != null) {
        let roundResult = this.numericRoundService.getRoundResult(this.roundValueInfo, totalConsumptionLastHour);
        roomInfo.consumptionLastHourValue = roundResult.value;
        roomInfo.consumptionLastHourUom = roundResult.uom;
        roomInfo.consumptionLastHourLabel = roundResult.label;
      }

      if (mostRecentTimestamp == null) {
        mostRecentTimestamp = timestamp;
      } else {
        if (timestamp > mostRecentTimestamp) {
          mostRecentTimestamp = timestamp;
        }
      }

    });

    //update
    roomInfo = this.replaceLastUpdatedTimestamp(roomInfo, mostRecentTimestamp);

    return roomInfo;
  }


  updateRoomWithWaterMeterData(roomInfo,allWaterMeterData){
    let mostRecentTimestamp = null;
    let mostRecentConsumption = null;
    allWaterMeterData.forEach(waterMeterData =>{
      const timestamp = waterMeterData['timestamp'];
      if(mostRecentTimestamp == null){
        mostRecentTimestamp = timestamp;
        mostRecentConsumption = waterMeterData['last_hour_consumption'];
      } else {
        if(timestamp > mostRecentTimestamp){
          mostRecentTimestamp = timestamp;
          mostRecentConsumption = waterMeterData['last_hour_consumption'];
        }
      }
    });

    roomInfo.waterConsumptionLastHour = mostRecentConsumption;
    roomInfo = this.replaceLastUpdatedTimestamp(roomInfo, mostRecentTimestamp);
  }

  /**
   *
   * @param roomInfo roomInfo
   * @param timestamp timestamp to be compare with roomInfo.timestamp
   */
  replaceLastUpdatedTimestamp(roomInfo, timestamp) {
    const roomInfoTimestamp = roomInfo['timestamp'];

    if (!roomInfoTimestamp) {
      //first timestamp, lets add anyway
      roomInfo['timestamp'] = timestamp;
    } else {
      {
        if (roomInfoTimestamp < timestamp) {
          roomInfo['timestamp'] = timestamp;
        }
      }
    }
    return roomInfo;
  }


  selectBlueprintView() {
    this.isBlueprintViewSelected = true;
  }

  selectTableView() {
    this.isBlueprintViewSelected = false;
  }


  /**
   * build floorData(occupancy, sold, dnd etc) and roomsInfo for the given floorSummary
   *
   * @param floorSummary floor summary
   */
  buildFloorDetailsData(floorSummary) {
    // this.buildBlueprint(floorSummary);
    // clernInterval
    this.realTime = this.realtimeMap.get(this.selectedFloor.id);

    this.roomsInfo = [];
    this.realTime.startGettingRealTimeData(() => {
      //roms data
      this.buildRoomsInfo(floorSummary, true);
    });

  }


  /**
   * Build blueprint for the given floor summary
   * @param floorSummary the floorSummary
   */
  buildBlueprint(floorSummary) {
    if (this.blueprints) {
      this.blueprintInfo = this.blueprintService.getFloorById(floorSummary.id, this.blueprints);
    } else {
      this.blueprintService.getBlueprintPositions(this.propertyId).subscribe((res) => {
        if (res == null) {
          console.warn('Could not find blueprintPositions for propertyId: \'' + this.propertyId + '\'');
        } else {
          this.blueprints = res.blueprints;
          this.blueprintInfo = this.blueprintService.getFloorById(floorSummary.id, this.blueprints);
        }
      });
    }
  }

  onGridItemClick(itemClicked){
    this.unitSelected = itemClicked;
    this.onUnitClickEmitter.emit({unit: itemClicked, hideGridColumns: this.hideGridColumns});
  }

  
  onBackRoomDetail() {
    this.unitSelected = null;
    this.onBackRoomDetailEmitter.emit();
  }
  
  onChangeStructureFilter(structuredFiltered){
    this.unitSelected = this.roomsInfoMap[this.propertyId + "." + structuredFiltered['id']];
  }

}
