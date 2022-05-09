import { OnInit, Component, Input, OnChanges, AfterContentInit } from "@angular/core";
import { ControlService, AutomationEventService, withThermostatDeviceGroup } from "@alis/automation-ng";

@Component({
  selector: 'engineering-hvac-control-group',
  templateUrl: './hvac-control-group.component.html',
  styleUrls: ['./hvac-control-group.component.scss']
})
export class HVACControlGroupComponent extends withThermostatDeviceGroup implements AfterContentInit, OnInit {

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
  ngAfterContentInit() {
    this.getFanIconNumber();
  }

  getTempLabel(temperature) {

    const rounded = this.round(temperature);
    return isNaN(rounded) ? "--" : rounded;

  }



}
