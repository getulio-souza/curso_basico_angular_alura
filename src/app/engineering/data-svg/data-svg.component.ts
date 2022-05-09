import { AlertService, AlertData, AlertSeverity } from './../../services/alert/alert.service';
import { Component, OnInit, Input, ComponentFactory, ComponentRef, ViewContainerRef, EmbeddedViewRef, ComponentFactoryResolver, Inject, Renderer2, OnDestroy, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { ValveLeftComponent } from '../valve-left/valve-left.component';
import { ValveRightComponent } from '../valve-right/valve-right.component';
import { AbstractSvgDrawComponent } from '../../abstracts/abstractSvgDrawComponent';
import { DataService } from '../../services/data/data.service';
import { RealTime } from '../../abstracts/realTime';
import { TemperatureService } from '../../services/temperatureService/temperature.service';
import { AssetsService } from '@alis/ng-services';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { AutomationRegistrationService } from '@alis/automation-ng';
import { OwlOptions } from 'ngx-owl-carousel-o/lib/models/owl-options.model';

@Component({
  selector: 'engineering-data-svg',
  templateUrl: './data-svg.component.html',
  styleUrls: ['./data-svg.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('800ms')),
    ])
  ]
})
export class DataSvgComponent implements OnInit, OnChanges, OnDestroy {

  componentClassMap = {
    valveLeft: ValveLeftComponent,
    valveRight: ValveRightComponent
  }

  private static ACTIVE_CLASS = "active";


  public static INVALID_VALUE = "invalid";

  @Input() propertyId;
  @Input() svgConfig;
  @Input() alertConfig;
  @Input() selectedComponent;
  @Input() selectedAlert;
  @Input() temperatureUomIsFahrenheit;
  @Input() pressureUomIsPsi;

  @Output() onElementMouseEnterEmitter = new EventEmitter();
  @Output() onElementMouseLeaveEmitter = new EventEmitter();
  @Output() onAlertIconHoverEmitter = new EventEmitter();
  @Output() onGetNewAlertsEmitter = new EventEmitter();


  realTime: RealTime;

  alertConfigMap = {};
  alertsMap: Map<string,AlertData>;

  svgContainerId;
  svgContainerElement: HTMLElement;
  rootViewContainer: ViewContainerRef;
  temps;

  dynamicValues = [];
  alertFromConfig = [];
  alerts = [];

  // a map between deviceId
  // and component config Data
  devicesComponentMap: Map<string,any>;

  selectedItem;
  selectedDevice;
  activeItem;
  lastActiveItem;

  isLoading = null;;
  showSendingCommand;

  controlImageSvg;

  automationWebsocket: WebSocket;




  constructor(private assetsService: AssetsService,
    @Inject(ComponentFactoryResolver) private factoryResolver,
    @Inject(ViewContainerRef) viewContainerRef,
    private render: Renderer2,
    private automationService: AutomationRegistrationService,
    private dataService: DataService,
    private temperatureService: TemperatureService,
    private alertService: AlertService
  ) {

    this.rootViewContainer = viewContainerRef;


  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }

  }

  ngOnInit() {
    // defines svgContainerId based on the svgId
    this.svgContainerId = 'svgContainerId-' + this.svgConfig.svg;
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (this.selectedComponent == DataSvgComponent.INVALID_VALUE) {
      return;
    }

    if (
      changes.selectedComponent &&
      !changes.selectedComponent.isFirstChange() &&
      this.selectedComponent != null) {

      const anchor = document.getElementById(this.selectedComponent['anchor']);
      if (anchor != null) {
        this.onComponentClick(this.selectedComponent, anchor);
      } else {
        console.warn("Did not take any action cause anchorId '" + this.selectedComponent['anchor'] +
          "' was not found in document");
      }
      // just changing selected component
      //should not get remote data again 
      return;
    }


    if( changes.selectedAlert &&
      !changes.selectedAlert.isFirstChange() &&
      this.selectedAlert != null) {
  
      // there is active alarm
      let svgAlertConfig = this.devicesComponentMap.get(this.selectedAlert.deviceId);
      this.onAlertIconHoverEmitter.emit({ svgAlertConfig: svgAlertConfig, alert: alert})
 
      return ;
    }


    this.buildAlertConfigMap();
    //get svg data and then build components
    this.getSvgData();

  }

  buildAlert(svgAlertConfig, alert: AlertData) {
    
    let svg: any =  document.getElementById(svgAlertConfig.anchorId);
    
    let x = (svg.getBBox().x - 17).toString();
    let y = (svg.getBBox().y - 65).toString();

    var newElement: any =  document.getElementById(`alert-${svgAlertConfig.anchorId}`);
    if(newElement == null){
      // if is the first time this alert is being show, lets create it
      newElement = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
      newElement.setAttribute("x", x);
      newElement.setAttribute("y", y);
      newElement.setAttribute("width", '75');
      newElement.setAttribute("height", '75');
      newElement.setAttribute("id", `alert-${svgAlertConfig.anchorId}`);
      newElement.classList.add("alert-container");
    }
  
    
    const severity = alert.severity;
    let severityColor: string = this.alertConfigMap[severity];
    if(severityColor == null) {
      // there is no config for this severity color.
      severityColor = this.alertService.getDefaultColor(severityColor);
      console.warn("Using default color ' " + severityColor + "' for severity '" + severity + "' ")
    } 


    newElement.style.display = "block";
    newElement.innerHTML = this.alertService.getWarningSvg(severityColor);
    svg.appendChild(newElement);


    // adding hover handler to this warning
    let pathClick = newElement.getElementsByTagName("g")[0];
    pathClick.addEventListener('mouseenter', (event: Event) => {
      console.log("Alert hover", svgAlertConfig);
      this.selectedAlert = alert;
      event.stopPropagation();
      this.onAlertIconHoverEmitter.emit({ svgAlertConfig: svgAlertConfig, alert: alert})
    }, false);

  }

  buildAlertConfigMap() {

    this.alertConfigMap = {};
    if(this.alertConfig != null) {
      let severityConfig = this.alertConfig.severities;
      if(severityConfig != null) {
        Object.keys(severityConfig).forEach(key => {
          let severityColor = severityConfig[key].color;
          this.alertConfigMap[key]= severityColor;
        });
      }
    } else {
      console.warn("Alert config is not configured")
    }
  }


  getSvgData() {

    if (this.svgConfig == null || this.svgConfig.svg == null) {
      console.warn("Could not find svg config. Please check it.")
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.assetsService.getSvgAssetAsString(this.propertyId, this.svgConfig.svg).subscribe((svgString: string) => {
        this.svgContainerElement = document.getElementById(this.svgContainerId);

        if(this.svgContainerElement != null) {
          this.svgContainerElement.innerHTML = svgString;
          this.prepareToBuildComponentsFromConfig();
        }

        this.isLoading = false;

      }, (error) => {
        console.error("Error trying to get svg from svgConfig ", this.svgConfig);
        console.error(error);
        this.isLoading = false;
      });
    }, 500);
  }

  prepareToBuildComponentsFromConfig() {
    let components = this.svgConfig.components;

    if (!components) {
      console.warn("No components was found in dataSvg configs in appConfig file");
      return;
    }

    this.devicesComponentMap = new Map<string,any>();
    
    // iterating over components
    // replace a anchor for a label component or 
    // add it to dynamicValues array to be updated evert x time
    components.forEach(component => {
      const anchorId = component['anchor'];
      const mode = component['mode'];
      const deviceId = component['deviceId'];
      const name = component['name'];
      const traceType = component['traceType'];
      const value = component['value'];
      const attribute = component['attribute'];
      const controlType = component['control'];


      let data = {
        anchorId: anchorId,
        name: name,
        deviceId: deviceId,
        mode: mode,
        traceType: traceType,
        attribute: attribute
      };

      this.devicesComponentMap.set(deviceId, data);

      if (mode == 'label') {
        //if its a label, lets just replace
        //if not, lets find this value from server
        this.replaceValue(anchorId, value);
      } else if (mode == 'value' || mode == 'class' || mode == 'class2' || mode == 'generic') {
        this.dynamicValues.push(data);
      }  else {
        console.warn("anchorId: '" + anchorId + "'  was set to unknown mode: '" + mode + "' ");
      }


      if (controlType != null) {
        let container = document.getElementById(anchorId);
        if (container == null) {
          console.error("Could not find anchor control type with id '" + anchorId + "'")
          return;
        }
        container.addEventListener('click', (event) => {
          this.onComponentClick(component, container);
        }, false);

        container.addEventListener('mouseenter', (event) => {
          // if there is active alert,
          // let activate it
          let alert = this.alertsMap.get(component.deviceId);
          if (alert != null) {
            this.selectedAlert = alert;
          }
          this.onElementMouseEnterEmitter.emit(container);
        });

        container.addEventListener('mouseleave', (event) => {
          this.onElementMouseLeaveEmitter.emit(container);
        })
      }
    });

    this.updateDynamicValues();
    this.updateAlerts();

    if (!this.realTime) {
      this.realTime = new RealTime(this.svgConfig.timeToRefreshRealTimeDevices);
      this.realTime.startGettingRealTimeData(() => {
        this.updateDynamicValues();
        this.updateAlerts();
      });
    }
  }

  onComponentClick(component, container) {

    this.selectedItem = null;

    setTimeout(() => {
      this.lastActiveItem = this.activeItem;
      this.selectedItem = component;
      // deviceId from config (which is used in tracking) has propertyId (nucwework.Lutron.192.168.1.13-5)
      const id : string = component.deviceId;
      if(id.startsWith(this.propertyId + ".")){
        // only first time
        const deviceIdWithPropertyId = component.deviceId;
        // deviceId from automation is without propertyId (Lutron.192.168.1.13-5)
  
        const deviceIdWithoutPropertyId = deviceIdWithPropertyId.split(this.propertyId + ".")[1];

        // example: Lutron.192.168.1.13-5
        const deviceId = deviceIdWithoutPropertyId;

        this. selectedDevice = null;
        this.automationService.getDevice(deviceId).subscribe((device) => {
          this.selectedDevice = device;
        },(error) => {
          console.error("Error trying to get the received deviceId '" + deviceId + "'");
        })

        this.activeItem = container;

        let alert = this.alertsMap.get(component.deviceId);
        this.selectedAlert = alert;

        this.showControlDialog();
        this.addActiveClass();
      }
   
      
    }, 200);

   
  }



  addActiveClass() {
    this.activeItem.classList.add(DataSvgComponent.ACTIVE_CLASS);
    if (this.lastActiveItem != null && this.activeItem != this.lastActiveItem) {
      //just remove if the same item is not being clicked again
      this.lastActiveItem.classList.remove(DataSvgComponent.ACTIVE_CLASS);
    }
  }

  showControlDialog() {

    // simulates a click in controlButton to open dialog
    // (strange but it works, we should use Jquery which has import problems)
    document.getElementById("controlButton").click();
  }


  onHideDialog(event) {
    this.selectedDevice = null;
    if (this.activeItem != null) {
      this.activeItem.classList.remove(DataSvgComponent.ACTIVE_CLASS);
    }
  }


  /**
   * gets alerts for the given property
   * then it builds warning icons applying the appropriate color
   * adding click callback to
   */
  updateAlerts() {

    const anchorAlerts = (document.getElementsByClassName("alert-container") as HTMLCollectionOf<HTMLElement>);

    this.alertService.getAlertsByProperty(this.propertyId).subscribe((alerts) => {

      this.onGetNewAlertsEmitter.emit(
        {
          alerts: alerts,
          devicesComponentMap: this.devicesComponentMap,
          alertConfigMap: this.alertConfigMap
        }
        
        );

      // first lets hide all alerts
      Array.from(anchorAlerts).forEach((anchorl) => {
        anchorl.style.display = "none";
      });

      this.alerts = [];

      this.alertsMap = new Map();

      alerts.forEach( (alert: AlertData) => {
        let deviceId = alert.deviceId;

        
        let svgAlertConfig = this.devicesComponentMap.get(deviceId);
        
        
        if(svgAlertConfig == null) {
          return ;
        }

        this.alerts.push({
          severity: alert.severity,
          deviceId: alert.deviceId,
          timestamp: alert.startedAt,
          text: alert.text, 
          title: svgAlertConfig.name
        });

        alert['title'] = svgAlertConfig.name;

        if(svgAlertConfig == null) {
          console.warn("Received a alert from deviceId '" + deviceId + "' but there is no svg config for this device");
          return ;
        }


        if(this.selectedAlert != null && this.selectedAlert.deviceId == alert.deviceId){
          // we already have a selected alert and it has changed, so, lets updated it
          this.selectedAlert = alert;
        }
        
        this.alertsMap.set(alert.deviceId, alert);

        this.buildAlert(svgAlertConfig, alert);

      });


    });
  } 

  /**
   * gets last trace by device and apply value
   * it can change the color, the label or switch between elements
   * based on the mode in config
   */
  updateDynamicValues() {
    this.dynamicValues.forEach(dynamicValue => {
      const deviceId = dynamicValue.deviceId;
      const traceType = dynamicValue.traceType;
      const mode = dynamicValue.mode;
      const anchorId = dynamicValue.anchorId;
      const attribute = dynamicValue.attribute;

      this.dataService.getStateByOwnerTraceTypeAndDeviceId(this.propertyId,traceType,deviceId,true).subscribe((res) => {

        if (res == null) {
          return;
        }
        let value = res[attribute];
        this.applyValue(value, mode, anchorId, traceType, attribute);

      }, (error) => {
        console.error("error trying to get state for deviceId: '" + deviceId + "' and traceType '" + traceType + "'");
        console.error(error);
      })


    });

  }


  applyValue(value, mode, anchorId, traceType, attribute) {
    if (!isNaN(value)) {
      value = Math.round(value * 10) / 10;
    }
    if (value != null) {
      if (mode == 'value') {
        let valueLabel = this.temperatureService.buildTempLabels(value, this.temperatureUomIsFahrenheit);
        this.replaceValue(anchorId, valueLabel);
      } else if (mode == 'class') {
        this.applyClass(anchorId, value);
      } else if (mode == 'class2') {
        this.applyClass2(anchorId, value, traceType, attribute);
      } else if (mode == 'generic') {
        this.applyGenericValue(anchorId, value);
      } else {
        console.warn("Received unknown 'mode' as '" + mode + "'. Please check svg configs")
      }
    }
  }

  getControlImageSrc(selectedItem) {

      return this.assetsService.getFileUrl(this.propertyId, selectedItem.control).subscribe((res) => {
        return res;
      })
    
  }

  applyGenericValue(anchorId, value) {
    // lets get the group (normally 'on','off' and 'na' values)
    let parentElementToBeChanged = this.findChild(this.svgContainerId, anchorId);

    if (parentElementToBeChanged == null) {
      console.error("Error trying to find anchorId '" + anchorId + '');
      return;
    }

    //lets get the element by value
    let elementToBeChanged = this.findChild(parentElementToBeChanged.id, anchorId + "-" + value);

    let allElements = [];
    try {
      let nodes = parentElementToBeChanged.querySelectorAll("g");
      allElements = Array.from(nodes);
    } catch (error) {
      console.error("'applyGenericValue': error trying to query selector all 'g', we are not applying generic value to any element");
    }

 

    allElements.forEach(element => {
      if (element.id != null) {
        element.style.display = null;
      }
    });

    if (elementToBeChanged != null) {
      //if element by value is not null, lets hide the others elements
      allElements.forEach(element => {
        if (element.id != elementToBeChanged.id && element.id != "") {
          element.style.display = "none";
        }
      });
    }

  }
  applyClass(element, value) {
    let tagToBeChanged = this.findChild(this.svgContainerId, element);
    // let tagToBeChanged = document.getElementById(element);

    if (tagToBeChanged == null) {
      return;
    }
    //removing all classes
    let classArray = Array.from(tagToBeChanged.classList);
    classArray.forEach(currentClass => {
      tagToBeChanged.classList.remove(currentClass);
    });

    const className = element + "-" + value;
    tagToBeChanged.classList.add(className);

  }

  applyClass2(element, value, traceType, attribute) {

    if(traceType == null || attribute == null){
      console.warn("Did not apply class because mode class2 requires tracetype and attribute. Please check configs");
      return ;

    }
    let tagToBeChanged = this.findChild(this.svgContainerId, element);

    if (tagToBeChanged == null) {
      return;
    }
    //removing all classes
    let classArray = Array.from(tagToBeChanged.classList);

    if(classArray != null){
      classArray.forEach( (currentClass: string) => {
        if(currentClass.startsWith(traceType + "-" + attribute)){
          tagToBeChanged.classList.remove(currentClass);
        }
      });
    }
    

    const className = traceType + "-" + attribute + "-" + value;
    tagToBeChanged.classList.add(className);

  }

  replaceValue(tagId, value) {
    let tagToBeChanged: Element = this.findChild(this.svgContainerId, tagId);

    // our svg files in something like
    // <text id="_30_0_C" data-name="30,0°C" class="cls-21" transform="translate(578 380)">
    //   <tspan x="-20.703" y="0">30,0°C</tspan>
    // </text>
    if (tagToBeChanged == null) {
      console.error("Tried to find tagId '" + tagId + "' without success");
      return;
    }

    tagToBeChanged.innerHTML = value
  }


  getComponentClass(componentName) {
    let componentClass = this.componentClassMap[componentName];
    return componentClass;
  }

  findChild(elementId, childId): HTMLElement | null {
    let element = document.getElementById(elementId);
    if (element != null) {
      try {
        return element.querySelector(`[id=${childId}]`);
      } catch (error) {
        console.warn("Error trying to query selector " + `[id=${childId}]`);
        return null;
      }
      
    }
    return null;
  }


}
