import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StructureService } from '@alis/tracking-ng';
import { PropertiesService } from '@alis/ng-services';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { DataService, TraceType } from '../../../../services/data/data.service';
import { map, first } from 'rxjs/operators';
import { UnitData, UnitDataService } from '../../../../services/unit-data/unit-data.service';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RealTime } from '../../../../abstracts/realTime';


@Component({
  selector: 'app-room-control-page',
  templateUrl: './room-control-page.component.html',
  styleUrls: ['./room-control-page.component.scss']
})
export class RoomControlPage extends PropertyDataLoader implements OnInit, OnDestroy {

  rooms = [];
  selectedFloor;
  selectedRoom;
  temperatureUomIsFahrenheit;
  propertySubdivisionLevel = 1;
  propertySubdivisionLabel = "Floors"

  roomsInfo;
  roomsInfoMap;
  roomControlConfig;

  realTime: RealTime;

  // first time component being loaded
  firstTimeComponentLoaded = false;

  constructor(
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private dataService: DataService,
    private unitDataService: UnitDataService
  ) {
    super(
      translateService,
      structureService,
      propertiesService
    );

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });


  }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((res) => {

      let roomId = res.get("roomId");
      let floorId = res.get("floorId");

      if(roomId != null && floorId != null) {

        this.selectedFloor = this.structureService.getStructureByGivenStructureId(this.structure, floorId);
        this.selectedRoom = this.structureService.getStructureByGivenStructureId(this.structure, roomId);
  

      }


    })



  }

  afterPropertyHasBeenLoaded() {
    console.log('afterPropertyHasBeenLoaded...', this.properties);
    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.roomControlConfig = this.properties.roomControl;
    this.firstTimeComponentLoaded = true;

    const propertySummaryConfig = this.properties.propertySummary;
    if(propertySummaryConfig != null) {

      let configLevel = propertySummaryConfig.propertySubdivision;

      if(configLevel != null) {
        this.propertySubdivisionLevel = configLevel.level != null ? configLevel.level : 1;
        this.propertySubdivisionLabel = configLevel.label != null ? configLevel.label : 'Floors';
        
      }
      
    }
    console.log("properties");
    console.log(this.properties);
  }

  onChangeStructureFilter(structure) {
    this.selectedFloor = structure;

    let unitsLevel0Ids: Set<any> = this.structureService.getAllStructIdsByGivenStructureAndLevel(structure,0);

 

    if (structure != null) {
      if (unitsLevel0Ids != null && unitsLevel0Ids.size > 0) {
        this.rooms = [];
        unitsLevel0Ids.forEach( (unitId) => {
          let filterStructure = this.structureService.getStructureByGivenStructureId(structure, unitId);
          this.rooms.push(filterStructure) 
        });;

        if (this.selectedRoom == null || !this.firstTimeComponentLoaded) {
            // if there is no selectedRoom from router
            this.selectedRoom = this.rooms[0];
            this.navigateToRoomControl(this.selectedRoom.id, this.selectedFloor.id)
        }
        
        this.firstTimeComponentLoaded = false;

      }
    }
    
    this.getPropertyUnitData(structure,unitsLevel0Ids);

    if (!this.realTime) {
      this.realTime = new RealTime();
    } else {
      this.realTime.clearInterval();
      
      this.realTime.startGettingRealTimeData(() => {
        this.getPropertyUnitData(structure,unitsLevel0Ids);
      });
    }

    
  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }
  }

  onChangeStructureFilter2(event) {
    this.navigateToRoomControl(event.id,this.selectedFloor.id);
    this.selectedRoom = event;

  }

  getPropertyUnitData(structure,unitsLevel0Ids) {

    let roomIds = unitsLevel0Ids;



    const roomsInfoData = this.unitDataService.buildRoomsInfos(this.propertyId, roomIds, structure);
    this.roomsInfoMap = roomsInfoData.roomsInfoMap;
    this.roomsInfo = roomsInfoData.roomsInfo;

    this.dataService.getStatesByOwnerAndTagAndTraceType(this.propertyId, structure.id, TraceType.UNIT).subscribe(((unitTraces) => {
      unitTraces.forEach(unitTrace => {
        let roomsInfoData = this.unitDataService.buildRoomsInfos(this.propertyId, roomIds, structure);
        this.roomsInfoMap = roomsInfoData.roomsInfoMap;
        this.roomsInfo = roomsInfoData.roomsInfo;
        let currentRoomInfo = this.roomsInfoMap[unitTrace['unitName']];
        if (currentRoomInfo != null) {
          currentRoomInfo = this.unitDataService.updateRoomData(currentRoomInfo, unitTrace, this.temperatureUomIsFahrenheit);
        }
      });

      this.roomsInfo = this.roomsInfo.splice(0);
    }))


  }


  navigateToRoomControl(roomId, floorId) {
    const route = "/propertyApp/" + this.propertyId + "/roomControl";
    this.route.navigate([route,{roomId: roomId, floorId: floorId }]);
  }

  onSelectedRoomChange(event) {
    this.navigateToRoomControl(event.id, this.selectedFloor.id);
  }


}

