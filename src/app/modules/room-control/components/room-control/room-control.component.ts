import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { AutomationRegistrationService, Unit, AutomationEventService, ControlService, UnitTemplate, DeviceGroup, DeviceTemplate } from '@alis/automation-ng';
import { forkJoin, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'room-control',
  templateUrl: './room-control.component.html',
  styleUrls: ['./room-control.component.scss']
})
export class RoomControlComponent implements OnChanges {


  @Input() propertyId;
  @Input() selectedRoom;
  @Input() roomControlConfig;

  unitTemplate: UnitTemplate;
  deviceTemplateMap = new Map<string, DeviceTemplate>();
  deviceTypeMap = new Map<string, Array<DeviceGroup>>();

  loadingUnit = false;

  constructor(
    private automationService: AutomationRegistrationService,
    private translateService: TranslateService) {
  }

  ngOnInit() {

  }

  ngOnChanges(simpleChanges: SimpleChanges) {


    if (this.selectedRoom == null) {
      return;
    }

    this.loadingUnit = true;
    forkJoin([this.getUnitRequest(), this.getUnitTemplatesRequest()]).subscribe((res) => {
      this.loadingUnit = false;

      const unit = res[0];
      const unitTemplates = res[1];

      if (unit == null) {
        console.error("Received unit as null");
        return;
      }

      if (unitTemplates == null) {
        console.error("Received unitTemplates as null");
        return;
      }


      
      this.deviceTemplateMap.clear();
      this.deviceTypeMap.clear();

      this.buildDeviceTypeMap(unit.deviceGroups);

      this.unitTemplate = this.getUnitTemplateByUnitTemplateId(unitTemplates, unit.unitTemplate);
      this.buildDeviceTemplateMap();


    }, (error) => {
      console.error("Error trying to get unit data");
      this.deviceTemplateMap.clear();
      this.deviceTypeMap.clear();
      this.loadingUnit = false;
    });
  }

  buildDeviceTemplateMap() {
    this.unitTemplate.deviceTemplates.forEach(deviceTemplate => {
      this.deviceTemplateMap.set(deviceTemplate.id, deviceTemplate);
    });
  }
  buildDeviceTypeMap(deviceGroups: Array<DeviceGroup>) {


    deviceGroups.forEach(deviceGroup => {
      let deviceGroupsFromMap = this.deviceTypeMap.get(deviceGroup.deviceType);
      if (deviceGroupsFromMap == null) {
        deviceGroupsFromMap = [];
      }
      deviceGroupsFromMap.push(deviceGroup);
      this.deviceTypeMap.set(deviceGroup.deviceType, deviceGroupsFromMap);
    });

  }

  getUnitTemplateByUnitTemplateId(unitTemplates, unitTemplateId) {
    for (let i = 0; i < unitTemplates.length; i++) {
      if (unitTemplates[i].id == unitTemplateId) {
        return unitTemplates[i];
      }
    }
    return null;
  }


  getUnitRequest(): Observable<Unit> {
    // return this.automationService.getUnitById(this.propertyId + "." + this.selectedRoom.id);
    return null;
  }

  getUnitTemplatesRequest(): Observable<UnitTemplate[]> {
    // return this.automationService.getUnitTemplates();
    return of(null);
  }

  getDeviceTemplateName(device) {
    if(device == null) {
      return '--' ;
    }
    if(this.deviceTemplateMap) {
      let deviceTemplate = device.deviceTemplate
      if(deviceTemplate != null) {
        let dTFromAutomation = this.deviceTemplateMap.get(deviceTemplate);
        let dtFromAutomatioName = dTFromAutomation.name;
        if(this.roomControlConfig != null){
          let deviceTemplatesConfig = this.roomControlConfig.deviceTemplates;
          if(deviceTemplatesConfig != null){
            let ret = deviceTemplatesConfig[dtFromAutomatioName];
            if(ret == null){
              ret = dtFromAutomatioName;
            }

            return this.translateService.instant(ret);
          }
        } else {
          return dtFromAutomatioName;
        }
      }
    }

    return '--';
  }



}
