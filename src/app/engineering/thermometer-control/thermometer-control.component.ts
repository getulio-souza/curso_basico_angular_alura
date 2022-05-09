import { OnInit, Component, Input, OnChanges, SimpleChange } from "@angular/core";
import { ControlService, AutomationEventService } from "@alis/automation-ng";
import { AbstractDeviceComponent } from "@alis/customer-base";
import { ToastErrorService } from "@alis/ng-services";
import { TemperatureService } from "../../services/temperatureService/temperature.service";

@Component({
  selector: 'engineering-thermometer-control',
  templateUrl: './thermometer-control.component.html',
  styleUrls: ['./thermometer-control.component.scss']
})
export class ThermometerControlComponent extends AbstractDeviceComponent implements OnInit {

  @Input() device;
  @Input() deviceConfig;
  @Input() temperatureUomIsFahrenheit;

  uomIsFahrenheit: boolean;
  temperature = null;
  hasError = false;

  constructor(
    controlService: ControlService,
    eventService: AutomationEventService,
    toastErrorService: ToastErrorService,
    private temperatureService: TemperatureService) {
    super(controlService, eventService, toastErrorService);

  }

  ngOnInit() {
    super.ngOnInit();
    let isFah = this.temperatureUomIsFahrenheit
    this.uomIsFahrenheit = isFah != null ? isFah : false;


  }

  onError(obj){
    super.onError(obj);
    this.hasError = true;
  }


  setTemperatureUomIsFahrenheit(uomIsFahrenheit) {
    this.uomIsFahrenheit = uomIsFahrenheit;
  }
  
  
  getTempLabel() {
    return this.temperatureService.buildTempLabels(this.temperature, this.uomIsFahrenheit);
  }


}
