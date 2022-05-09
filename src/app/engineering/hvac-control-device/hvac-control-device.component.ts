import { OnInit, Component, Input, OnChanges, AfterContentInit } from "@angular/core";
import { ControlService, AutomationEventService, withThermostatDevice } from "@alis/automation-ng";

@Component({
  selector: 'engineering-hvac-control-device',
  templateUrl: './hvac-control-device.component.html',
  styleUrls: ['./hvac-control-device.component.scss']
})
export class HVACControlDeviceComponent extends withThermostatDevice implements OnInit, AfterContentInit {

  //CONTROLS DEVICE GROUP

  @Input() device;
  fanIconNumber: string;

  constructor(controlService: ControlService,
    eventService: AutomationEventService) {
    super(controlService, eventService);

    this.cool_setpoint = 18;
    this.heat_setpoint = 18;
  }

  /**
   * Workaround to circumvent AOT Angular lifecyle bug with mixins
   * Source: https://github.com/angular/angular/issues/19145
   */
  ngOnInit(): void {
    super.ngOnInit();
  }


  ngAfterContentInit() {
    this.getFanIconNumber();
  }


  getFanIconNumber(): string {
    switch (this.fanspeed) {
      case 'medium': {
        this.fanIconNumber = '02';
        this.setPointNumberFanSpeed = 2;
        break;
      }
      case 'high': {
        this.fanIconNumber = '03';
        this.setPointNumberFanSpeed = 3;
        break;
      }
      case 'auto': {
        this.fanIconNumber = 'auto';
        this.setPointNumberFanSpeed = 0;
        break;
      }
      case 'low': {
        this.fanIconNumber = '01';
        this.setPointNumberFanSpeed = 1;
        break;
      }
      default: {
        this.fanIconNumber = 'auto';
        this.setPointNumberFanSpeed = 0;
        break;
      }
    }
    return this.fanIconNumber;
  }

  getTempLabel(temperature) {

    const rounded = this.round(temperature);
    return isNaN(rounded) ? "--" : rounded;

  }


}
