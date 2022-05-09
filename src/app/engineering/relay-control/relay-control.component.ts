import { OnInit, Component, Input, OnChanges, Renderer2, NgZone, OnDestroy } from "@angular/core";
import { ControlService, AutomationEventService, withLightDevice } from "@alis/automation-ng";
import { AbstractLight } from "@alis/customer-base";
import { ToastErrorService, AssetsService } from "@alis/ng-services";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'engineering-relay-control',
  templateUrl: './relay-control.component.html',
  styleUrls: ['./relay-control.component.scss']
})
export class RelayControlComponent extends withLightDevice implements OnInit, OnChanges, OnDestroy {


  @Input() propertyId;
  @Input() device;
  @Input() deviceConfig;

  controlImageSvg;
  isOn: boolean
  dataLoading = true;
  hasError = false;

  constructor(
    private assetsService: AssetsService,
    private sanitizer: DomSanitizer,
    controlService: ControlService,
    eventService: AutomationEventService,
    renderer2: Renderer2) {
        super(controlService, eventService, renderer2);

  }
  
  ngOnChanges(changes) {
    this.dataLoading = true;
    super.ngOnInit();
  }

  ngOnDestroy(){
    
  }
  ngAfterContentInit() {

    super.ngAfterContentInit();

    this.updateIsOn();
    
    
    this.updateControlImage();
    
    if(this['state'] != null){
      this.dataLoading = false;
      this.hasError = false;
    } 

  }

  updateIsOn() {
    if (this['state'] == 'on') {
      this.isOn = true;
    } else {
      this.isOn = false;;
    }
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
    this.assetsService.getSvgAssetAsString(this.propertyId, this.deviceConfig.control).subscribe((svgStr) => {
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

   super.onEvent(message);
   this.updateIsOn();
   this.updateControlImage();

  }

  updateControlImage() {
    let controlImageElement = document.getElementById("controlImage");

    if(controlImageElement != null){
      if (this.isOn) {
        controlImageElement.classList.remove("off");
        controlImageElement.classList.add("on");
      } else {
        controlImageElement.classList.remove("on");
        controlImageElement.classList.add("off");
      }
    }
    
  }


  onRelayChange(event) {
    this.isOn = !this.isOn;

    this.updateControlImage();


    this.onClick(event);
  }

}
