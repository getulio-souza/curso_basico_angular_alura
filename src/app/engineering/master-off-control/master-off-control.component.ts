import { OnInit, Component, Input, OnChanges, EventEmitter, Output, Renderer2 } from "@angular/core";
import { withLightDevice, ControlService, AutomationEventService, withLightDeviceGroup } from "@alis/automation-ng";


@Component({
  selector: 'engineering-master-off-control',
  templateUrl: './master-off-control.component.html',
  styleUrls: ['./master-off-control.component.scss']
})
export class MasterOffControlComponent extends withLightDeviceGroup {

  @Input() propertyId;
  @Input() device;
  color = 'rgb(236, 211, 80)';
  colorWhite = '#ffffff';

  constructor(controlService: ControlService,
    eventService: AutomationEventService, renderer: Renderer2) {
    super(controlService, eventService, renderer);

  }

  /**
   * Workaround to circumvent AOT Angular lifecyle bug with mixins
   * Source: https://github.com/angular/angular/issues/19145
   */
  ngOnInit(): void {
    super.ngOnInit();
  }



}
