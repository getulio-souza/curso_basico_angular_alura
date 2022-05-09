import { OnInit, Component, Input } from "@angular/core";
import { ControlService, AutomationEventService } from "@alis/automation-ng";
import { AbstractDeviceComponent } from "@alis/customer-base";
import { ToastErrorService } from "@alis/ng-services";
import { ManometerService } from "../../services/manometerService/manometer.service";


@Component({
  selector: 'engineering-manometer-control',
  templateUrl: './manometer-control.component.html',
  styleUrls: ['./manometer-control.component.scss']
})
export class ManometerControlComponent extends AbstractDeviceComponent implements OnInit {

  @Input() device;
  @Input() pressureUomIsPsi;
  @Input() deviceConfig;

  pressure = null;
  hasError = false;

  constructor(
    controlService: ControlService,
    eventService: AutomationEventService,
    toastErrorService: ToastErrorService,
    private manometerService: ManometerService) {
    super(controlService, eventService, toastErrorService);

  }

  ngOnInit() {
    super.ngOnInit();
  }
  
  onError(obj){
    super.onError(obj);
    this.hasError = true;
  }

  setPressureUomIsPsi(uomIsPsi) {
    this.pressureUomIsPsi = uomIsPsi;
  }
  
  
  getPressureLabel() {
    return this.manometerService.buildPressureLabels(this.pressure, this.pressureUomIsPsi);
  }


}
