import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { forkJoin } from 'rxjs';
import { Structure, StructureService } from '@alis/tracking-ng';
import { map } from 'rxjs/operators';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'app-grid-devices',
  templateUrl: './grid-devices.component.html',
  styleUrls: ['./grid-devices.component.scss']
})
export class GridDevicesComponent implements OnInit, OnChanges {

  panelOpen = false;

  @Input() propertyId;

  @Input() deviceTypes: Array<string>;
  @Input() icon: string;
  @Input() showDataButton = false;
  @Input() structure;

  deviceTypeMap = new Map();

  structureMapName = new Map();
  customColumns;
  panelHeightInitial;

  realTime: RealTime;
  
  data;

  cols = [
    { field: 'unitLabel', header: 'Unit' },
    { field: 'deviceType', header: 'Device Type' },
    { field: 'lastTraceReceived', header: 'Last Updated' },
    { field: 'deviceStatus', header: 'Connection' }
  ];

  multiSortMeta = [
    { field: 'lastTraceReceived', order: 1 }
  ]
  constructor(private dataService: DataService, private structureService: StructureService) {
    this.panelHeightInitial = '70px';
  }

  ngOnInit() {
    let units = this.structure.units;

    //lets get all structure ids-name
    //cause a devie can be in a non 0 level
    let maxLevel = 0;
    units.forEach(unit => {
      if (unit.level > maxLevel) {
        maxLevel = unit.level;
      }
    });

    this.buildStructureMapName(maxLevel);

  }

  ngOnChanges(changes: SimpleChanges): void {
    //actually, all information comes from one endpoint

    if (this.deviceTypes != null) {

      this.realTime = new RealTime();
      this.realTime.startGettingRealTimeData(() => {
        this.getData().subscribe((deviceTypeMap) => { 
          this.deviceTypeMap = deviceTypeMap;
          this.buildTable();
        });
      }); 

     
    }

  }

  buildTable() {
    let deviceStates = [];
    this.deviceTypes.forEach(traceType => {
      let deviceStatusByTraceType = this.deviceTypeMap.get(traceType);
      if (deviceStatusByTraceType != null) {
        deviceStates = deviceStates.concat(deviceStatusByTraceType);
      }
    });

    this.data = deviceStates;

  }

  getData() {
    return this.dataService.getDevicesStateByOwnerAndTraceType(this.propertyId, TraceType.DEVICE_STATUS).pipe(map((allDeviceStates) => {

      let deviceTypeMap = new Map();
      deviceTypeMap.set('all', allDeviceStates);

      allDeviceStates.forEach(deviceState => {

        deviceState['deviceStatus'] = deviceState['status'];

        //
        deviceState['deviceStatusNumber'] = deviceState['status'] == 'online' ? 1 : -1 ;

        //build unitLabel
        let unitName = deviceState['unitName'];
        if (unitName != null) {
          let unitLabel = this.structureMapName.get(deviceState['unitName']);
          if (unitLabel != null) {
            deviceState['unitLabel'] = unitLabel;
          }
        }


        let deviceType = deviceState['deviceType'];
        let deviceStates: Array<any> = deviceTypeMap.get(deviceType);
        if (deviceStates == null) { deviceStates = new Array(); }
        deviceStates.push(deviceState);
        deviceTypeMap.set(deviceType, deviceStates);



      });

      return deviceTypeMap;
    }));

  }
  

  buildStructureMapName(maxLevel) {
    for (let level = maxLevel; level >= 0; level--) {
      let structuresidsSet: Set<any> = this.structureService.getAllStructIdsByGivenStructureAndLevel(this.structure, level);

      structuresidsSet.forEach(structureId => {
        let structure = this.structureService.getStructureByGivenStructureId(this.structure, structureId);
        this.structureMapName.set(this.propertyId + "." + structure['id'], structure['name']);
      });
    }
  }

  getRequest(traceType) {
    return this.dataService.getDevicesStateByOwnerAndTraceType(this.propertyId, traceType);
  }

  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }
}
