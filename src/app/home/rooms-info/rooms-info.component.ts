import { FakeDataService } from '../../services/fake-data/fake-data.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AutomationRegistrationService, UnitVerification } from '@alis/automation-ng'
import { UnitTemplateInformation } from '@alis/proxper-base';

declare const $: any;

@Component({
  selector: 'home-page-rooms-info',
  templateUrl: './rooms-info.component.html',
  styleUrls: ['./rooms-info.component.less']
})
export class RoomsInfoComponent implements OnInit {

  @Input() propertyId;
  @Input() unitVerificationMap;
  @Input() zones;
  
  links;
  el: ElementRef;

  unitTemplateInformations = [];

  constructor(private automationRegistrationService: AutomationRegistrationService, private fakeDataService: FakeDataService, el: ElementRef) {
    this.el = el;
  }

  activeTooltip(activate: boolean = true) {
    const options = activate ? { container: 'body' } : 'destroy';
    this.links.forEach((link) => $(link).tooltip(options));
  }

  ngOnInit() {
    this.links = this.el.nativeElement.querySelectorAll('[data-toggle="tooltip"]');

    //has not yet received for binding
    //lets try to get it
    if (!this.unitVerificationMap) {
      this.automationRegistrationService.getUnitVerificationMap(this.propertyId).subscribe((unitVerificationMap) => {
        let unitTemplateInformationMap = this.buildUnitTemplateInformationMap(unitVerificationMap);
        this.unitTemplateInformations = this.fromUnitTemplateInfoMapToArray(unitTemplateInformationMap);
      }, (error) => {
        console.error("Error trying to get UnitVerificationMap");
        console.error(error);
      })
    } else {
      //has already received unitVerificationMap from parent component
      let unitTemplateInformationMap = this.buildUnitTemplateInformationMap(this.unitVerificationMap);
      this.unitTemplateInformations = this.fromUnitTemplateInfoMapToArray(unitTemplateInformationMap);
    }


  }


  buildUnitTemplateInformationMap(unitVerificationMap) {
    let unitTemplateInformationMap = {};
    for (var unitId in unitVerificationMap) {
      if (unitVerificationMap.hasOwnProperty(unitId)) {
        let unitVerification: UnitVerification = unitVerificationMap[unitId];

        let unitTemplateId = unitVerification.unitTemplate.id;
        let currentUnitTemplateInformation: UnitTemplateInformation = unitTemplateInformationMap[unitTemplateId];
        if (!currentUnitTemplateInformation) {
          //first time, lets create
          currentUnitTemplateInformation = new UnitTemplateInformation();
          unitTemplateInformationMap[unitTemplateId] = currentUnitTemplateInformation;
          currentUnitTemplateInformation.unitTemplate = unitVerification.unitTemplate;
          currentUnitTemplateInformation = this.initializeMissingDevices(currentUnitTemplateInformation, unitVerification.unitTemplate.deviceTemplates);

          currentUnitTemplateInformation.trace = this.fakeDataService.getTraceByTag(unitTemplateId);
        }
        currentUnitTemplateInformation.totalRooms++;
        if (unitVerification.missingTemplates.length > 0) {
          currentUnitTemplateInformation = this.handleUnitWithMissingTemplates(currentUnitTemplateInformation, unitVerification);
        }
      }
    }
    return unitTemplateInformationMap;
  }

  initializeMissingDevices(currentUnitTemplateInformation, deviceTemplates) {
    deviceTemplates.forEach(deviceTemplate => {
      if (!currentUnitTemplateInformation.missingDeviceType[deviceTemplate.deviceType]) {
        currentUnitTemplateInformation.missingDeviceType[deviceTemplate.deviceType] = {};
        currentUnitTemplateInformation.missingDeviceType[deviceTemplate.deviceType].devices = 0;
        currentUnitTemplateInformation.missingDeviceType[deviceTemplate.deviceType].rooms = 0;
      }

      if (!currentUnitTemplateInformation.missingDeviceTemplate[deviceTemplate.id]) {
        currentUnitTemplateInformation.missingDeviceTemplate[deviceTemplate.id] = {};
        currentUnitTemplateInformation.missingDeviceTemplate[deviceTemplate.id].devices = 0;
        currentUnitTemplateInformation.missingDeviceTemplate[deviceTemplate.id].rooms = 0;
      }
    });

    return currentUnitTemplateInformation;
  }
  handleUnitWithMissingTemplates(currentUnitTemplateInformation, unitVerification) {
    //there is at least one missing template for this unitId
    let missingDeviceTypes = new Set();
    let missingDeviceTemplates = new Set();

    currentUnitTemplateInformation.totalRoomMissing++;

    unitVerification.missingTemplates.forEach(missingTemplate => {
      currentUnitTemplateInformation.missingDeviceType[missingTemplate.deviceType].devices++;
      currentUnitTemplateInformation.missingDeviceTemplate[missingTemplate.id].devices++;
      missingDeviceTypes.add(missingTemplate.deviceType);
      missingDeviceTemplates.add(missingTemplate.id);
    });


    missingDeviceTypes.forEach( (deviceType : string) => {
      currentUnitTemplateInformation.missingDeviceType[deviceType].rooms++;
    });

    missingDeviceTemplates.forEach( (deviceTemplateId: string) => {
      currentUnitTemplateInformation.missingDeviceTemplate[deviceTemplateId].rooms++;
    });


    return currentUnitTemplateInformation;
  }

  fromUnitTemplateInfoMapToArray(unitTemplateInformationMap) {

    let unitTemplateInformations = [];
    for (var unitTemplateId in unitTemplateInformationMap) {
      if (unitTemplateInformationMap.hasOwnProperty(unitTemplateId)) {
        unitTemplateInformations.push(unitTemplateInformationMap[unitTemplateId]);
      }
    }

    return unitTemplateInformations;
  }

  getMissingToolTip(unitTemplateInfo, deviceType) {

    let countMissingDeviceType = unitTemplateInfo.missingDeviceType[deviceType];
    let countDevices;
    let countRooms;

    if (!countMissingDeviceType) {
      return '';
    }

    countDevices = countMissingDeviceType.devices;
    countRooms = countMissingDeviceType.rooms;
    return countDevices + " " + deviceType + "(s) with problem(s) in " + countRooms + " room(s)"



  }

}
