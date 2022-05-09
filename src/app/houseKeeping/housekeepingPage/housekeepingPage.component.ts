import { FakeDataService } from './../../services/fake-data/fake-data.service';
import { TranslateService } from '@ngx-translate/core';
import { StructureService } from '@alis/tracking-ng';
import { PropertiesService } from '@alis/ng-services';
import { PropertyDataLoader } from '../../home/propertyDataLoader';
import { Component, OnInit, NgZone } from '@angular/core';
import { DateService } from '../../services/date/date.service';


@Component({
  selector: 'app-housekeeping',
  templateUrl: './housekeepingPage.component.html',
  styleUrls: ['./housekeepingPage.component.less']
})
export class HousekeepingPageComponent extends PropertyDataLoader implements OnInit {
  
  unitTraceMap;

  //defines the max date to be used in engineer charts
  //tipically is one hour ago
  //date before one hour will be shown as 'not available'
  //or discarted depending on chart type
  dateToAcceptData;

  showGridRooms = false;
  gridData;
  gridName;

  customColumns =
    [
      { field: 'name', header: 'Name' },
      { field: 'dnd', header: 'State' },
      { field: 'stateSince', header: 'State since' },
      { field: 'stateDurationLabel', header: 'State Duration' },
      { field: 'timestamp', header: 'Last Updated' },
    ];


  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private dateService: DateService) {
    super(translateService, structureService, propertiesService);

    this.loadData(()=>{
      this.afterPropertyHasBeenLoaded();
    })

  }

  ngOnInit() {

  }

  public afterPropertyHasBeenLoaded() {
    // using tempTraceMap to make sure angular binding is detecting changes
    // in traceMap variable;
    this.unitTraceMap = {};

    this.dateToAcceptData = this.dateService.getOneHourBefore();;

    // first, lets iterate over structureIds to get all structureIds and room name
    // and build a initial map
    const structureIds = this.structureService.getAllStructIdsByGivenStructureAndLevel(this.structure, 0);

    structureIds.forEach(idFromStructure => {
      // TODO: trackingService should understand full unitIds
      const unitId = this.propertyId + '.' + idFromStructure;
      const roomInfo = this.structureService.getStructureByGivenStructureId(this.structure, idFromStructure);
      const roomName = (roomInfo && roomInfo.name) ? roomInfo.name : idFromStructure;
      this.unitTraceMap[unitId] = {};
      this.unitTraceMap[unitId]['name'] = roomName;
    });
  }

  onCharClick(event) {
    this.showGridRooms = true;
    this.gridData = event.dataArray;
    this.gridName = event.name;
  }

  back(event) {
    this.showGridRooms = false;
  }

}
