import { AlertService } from './../../../../services/alert/alert.service';
import { DataSvgComponent } from './../../../../engineering/data-svg/data-svg.component';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlertData } from '../../../../services/alert/alert.service';

@Component({
  selector: 'app-bms',
  templateUrl: './bms.component.html',
  styleUrls: ['./bms.component.scss']
})
export class BMSComponent implements OnInit, OnChanges {

  @Input() propertyId;
  @Input() temperatureUomIsFahrenheit;
  @Input() pressureUomIsPsi;
  @Input() bmsConfig: Array<any>;
  @Input() alertConfig;
  @Input() selectedFloor;

  // a map between deviceId
  // and current alert
  alertsMap = new Map<string,AlertData>();

  alertConfigMap = new Map<string,any>();

  selectedComponent;
  selectedAlert;

  svgConfig;
  currentSvgElementHover = null;

  

  constructor(private alertService: AlertService) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {    

    const floorId = this.selectedFloor['id'];
    this.svgConfig = this.findConfigByFloor(floorId);
    if(this.svgConfig == null){
      console.warn("Did not find any bmsConfig for selectedFloor '" + this.selectedFloor['id'] + "'", this.bmsConfig);
    }
  }

  findConfigByFloor(floorId){
    let config = null;

    if(floorId == null){
      return config;
    }

    if(this.bmsConfig != null) {
      for(let i=0;i<this.bmsConfig.length;i++){
        const currentConfig = this.bmsConfig[i];
        const configFloorId = currentConfig['floorId'];
        if(floorId == configFloorId){
          config = currentConfig;
          return config;
        }
      }
    }
    
    return config;

  }

  onElementMouseEnter(component){
    if(component != null){
      this.currentSvgElementHover = component.id;
    }
  }


  onElementMouseLeave(component) {
    this.currentSvgElementHover = null;
  }

  onMouseLegendEnter(event, component) {
    const element = document.getElementById(component.anchor);
    if(element != null) {
      element.classList.add('hover');
    }

    let alert = this.alertsMap.get(component.deviceId);
    if(alert != null) {
      this.selectedAlert = alert;
    }



  }
  
  onMouseLegendLeave(component) {
    const element = document.getElementById(component.anchor);
    if(element != null) {
      element.classList.remove('hover');
    }
  }

  onGetNewAlerts(event) {
    let currentAlerts: Array<AlertData> = event.alerts;

    this.alertConfigMap = event.alertConfigMap;

    this.alertsMap.clear();
    if(currentAlerts != null) {
      currentAlerts.forEach( (currentAlert) => {
        let deviceId = currentAlert.deviceId;
        this.alertsMap.set(deviceId,currentAlert);
      });
    }
  }

  hasActiveAlert(component) {

    const deviceId = component.deviceId;
    let alert = this.alertsMap.get(deviceId);
    
    if(alert != null){
      this.updateWarningIcon(deviceId);
      return true;
    }

    return false;
  }
  
  updateWarningIcon(deviceId) {

    let alertIcon = document.getElementById(`alert-icon-${deviceId}`);
    if(alertIcon == null) {
      return "";
    }

   
    const color = this.getWarningIconColorByConfig(deviceId);

    alertIcon.innerHTML = this.alertService.getWarningSvg(color);

    // return this.alertService.getWarningSvg(color);
  }

  getWarningIconColorByConfig(deviceId: string) {
  // default color
    let color;


    let severities = this.alertConfig.severities;
    let deviceConfig = this.alertsMap.get(deviceId);
    let alertSeverity;

    if(severities != null) {
      if(deviceConfig != null){
        alertSeverity = deviceConfig.severity;
        if(alertSeverity != null) {
          let severityConfig = severities[alertSeverity];
          if(severityConfig != null){
            color = severityConfig.color
          }
        }
      }
    }

    if(color != null){
      return color;
    }

    return this.alertService.getDefaultColor(alertSeverity);

  }


  onAlertIconHover(data) {

  }


  onLegendClick(component) {
    this.selectedComponent = component;
    setTimeout(() => {
      // just to make sure
      // if same component is clicked again
      // ngOnChanges of engineering-data-svg component
      // will detect changes
      this.selectedComponent = DataSvgComponent.INVALID_VALUE;
    }, 500);
  }


}
