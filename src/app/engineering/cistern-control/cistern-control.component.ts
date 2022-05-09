import { OnInit, Component, Input, OnChanges, Renderer2, NgZone, OnDestroy } from "@angular/core";
import { ControlService, AutomationEventService } from "@alis/automation-ng";
import { AbstractLight } from "@alis/customer-base";
import { ToastErrorService, AssetsService } from "@alis/ng-services";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'engineering-cistern-control',
  templateUrl: './cistern-control.component.html',
  styleUrls: ['./cistern-control.component.scss']
})
export class CisternControlComponent extends AbstractLight implements OnInit, OnChanges, OnDestroy {


  @Input() propertyId;
  @Input() device;

  controlImageSvg;
  dataLoading = true;
  hasError = false;

  constructor(
    private assetsService: AssetsService,
    private sanitizer: DomSanitizer,
    controlService: ControlService,
    eventService: AutomationEventService,
    toastErrorService: ToastErrorService,
    renderer2: Renderer2) {
        super(controlService, eventService, toastErrorService, renderer2);

  }

  ngOnChanges(changes) {
    this.dataLoading = true;

    // TODO
    // we do not have a spec to define which controls 
    // component should receive the device and not de config


    // this.deviceData.id = this.deviceData.deviceId;
 
    // // TODO - should get from deviceType (?)
    // this.deviceData.deviceType = 'Tank';

    // this.device = {};
    // this.device.id = this.deviceData.deviceId;
    // this.device.name = this.deviceData.name;
    // this.device.deviceType = this.deviceData.deviceType;

    super.ngOnInit();


  }

  ngAfterContentInit() {

    super.ngAfterContentInit();

    this.updateLevel();
    
    
    this.updateControlImage();
    
    //We need to define the component behavior
    // if(this['state'] != null){
    //   this.dataLoading = false;
    //   this.hasError = false;
    // } 
    this.dataLoading = false;
    this.hasError = false;

  }
  ngOnInit() {
    this.getControlImageSvg();
  }

  getDefaultAttributeValues(): Object {
    // starts with no values
    var ret = {};
    return ret;
}


  getControlImageSvg() {
    this.controlImageSvg = null;
    this.assetsService.getSvgAssetAsString(this.propertyId, 'cistern').subscribe((svgStr) => {
      this.controlImageSvg = svgStr;
      this.controlImageSvg = this.sanitizer.bypassSecurityTrustHtml(svgStr);
    })
  }

  onError(obj: any) {
    this.hasError = true;
    this.dataLoading = false;
  }

  onEvent(message: MessageEvent) {
    this.dataLoading = false;

    let event = JSON.parse(message.data)

    if(event != null){
      this.setAttributeInternal(event.attributeName, event.value);
      this.updateLevel();
      this.updateControlImage();
      this.hasError = false;
      return ;
    }

    this.hasError = true;

  }

  updateControlImage() {
    let controlImageElement = document.getElementById("controlImage");

    //We need to define the component behavior
    
  }

  updateLevel() {
    //We need to define the component behavior
  }

  ngOnDestroy() {

  }



}
