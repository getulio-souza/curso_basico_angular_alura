import { DateService } from './../../services/date/date.service';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../home/propertyDataLoader';

@Component({
  selector: 'app-engineering-page',
  templateUrl: './engineering-page.component.html',
  styleUrls: ['./engineering-page.component.less']
})
export class EngineeringPageComponent extends PropertyDataLoader implements OnInit {

  energyGroupId;
  structure;
  selectedFloor;
  temperatureUomIsFahrenheit;
  pressureUomIsPsi;
  thermostatLastTraces;
  activeConsumptionConfig;
  thermometersConfig = [];
  dataSvgsConfig = [];

  showEMSCards;
  showExternalDashboard;
  showAdvancedColdChamber;
  showSetpointDiffrentialChart;
  showChillerBoard;
  showPowerBoard;
  showColdChamberBoard;
  showThermostatBoard;
  showThermometersBoard;
  showThermostatOnlineBoard;
  showActiveConsumptionChart;
  showRelayPresenceChart;
  showConsumptionCharts;
  showOccupancyCharts;
  showCoolingDemandChart;


  availableEnergyGroups = [];
  selectedEnergyGroup;
  isSidebarOpen;

  weekProfileNumberOfWeeks;

  //defines the max date to be used in engineer charts
  //tipically is one hour ago
  //date before one hour will be shown as 'not available'
  //or discarted depending on chart type
  dateToAcceptData;

  showGridRooms = false;
  gridData;
  gridTitle;

  gridCols = [
    { field: 'name', header: 'Name' },
    { field: 'active-profile-label', header: 'Sold' },
    { field: 'presence', header: 'Occupied' },
    { field: 'setpointLabel', header: 'Setpoint' },
    { field: 'temperatureLabel', header: 'Temperature' },
    { field: 'timestamp', header: 'Last Updated' }
  ];
  
  // configs
  chillerConfig;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private dateService: DateService) {

    super(translateService, structureService, propertiesService);

    //fake - TODO - using real service use one hour ago
    //this.dateToAcceptData = 1542054105822;
    this.dateToAcceptData = dateService.getOneHourBefore();

    this.thermostatLastTraces = [{ 'unitName': 'dummy.10001', 'timestamp': 0 }];
    
    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    })
  }


  setWeekProfileNumberOfWeeks() {
    const energymanagement = this.properties.energymanagement
    if (energymanagement && energymanagement.numberOfWeeks) {
      this.weekProfileNumberOfWeeks = energymanagement.numberOfWeeks;
    } else {
      console.warn("Could not find 'energymanagement.numberOfWeeks' in properties file. Using 12 as default");
      this.weekProfileNumberOfWeeks = 12;
    }
  }

  ngOnInit() {
    this.availableEnergyGroups = new Array();
    this.availableEnergyGroups.push(this.propertyId);
  }

  onEnergyGroupChange(energyGroup) {
    this.selectedEnergyGroup = energyGroup;
  }

  public afterPropertyHasBeenLoaded() {

    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.pressureUomIsPsi = this.properties.pressureUomIsPsi;
    this.energyGroupId = this.propertyId;
    this.selectedEnergyGroup = this.propertyId;

    this.setWeekProfileNumberOfWeeks();

    this.buildThermometerConfig();
    this.buildDataSvgConfig();
    
    this.getWhichCardShouldBeShown();
  }

  getWhichCardShouldBeShown() {
    if (this.properties) {
      let engineeringConfig = this.properties.engineering;

      if (engineeringConfig) {

        // showEMSCards
        this.showEMSCards = engineeringConfig.showEMSCards;
        if (!this.showEMSCards) {
          console.warn('showEMSCards is false or was not set');
        }

        // externalDashboard
        this.showExternalDashboard = engineeringConfig.showExternalDashboard;
        if (!this.showExternalDashboard) {
          console.warn('showExternalDashboard is false or was not set');
        }

        // advancedColdChamber
        this.showAdvancedColdChamber = engineeringConfig.showAdvancedColdChamber;
        if (!this.showAdvancedColdChamber) {
          console.warn('showAdvancedColdChamber is false or was not set');
        }

        // differentialChart
        this.showSetpointDiffrentialChart = engineeringConfig.showSetpointDiffrentialChart;
        if (!this.showSetpointDiffrentialChart) {
          console.warn('showSetpointDiffrentialChart is false or was not set');
        }        // chiller board
        this.showChillerBoard = engineeringConfig.showChillerBoard;
        if (!this.showChillerBoard) {
          console.warn('showChillerBoard is false or was not set');
        } else {
          this.chillerConfig = engineeringConfig.chiller;
        }

        // power board
        this.showPowerBoard = engineeringConfig.showPowerBoard;
        if (!this.showPowerBoard) {
          console.warn('showPowerBoard is false or was not set');
        }

        // coldchamber board
        this.showColdChamberBoard = engineeringConfig.showColdChamberBoard;
        if (!this.showColdChamberBoard) {
          console.warn('showColdChamberBoard is false or was not set');
        }

        // thermostat board
        this.showThermostatBoard = engineeringConfig.showThermostatBoard;
        if (!this.showThermostatBoard) {
          console.warn('showThermostatBoard is false or was not set');
        }

         // thermostat board
         this.showThermometersBoard = engineeringConfig.showThermometersBoard;
         if (!this.showThermometersBoard) {
           console.warn('showThermometersBoard is false or was not set');
         }

         // thermostat online board
         this.showThermostatOnlineBoard = engineeringConfig.showThermostatOnlineBoard;
         if (!this.showThermostatOnlineBoard) {
           console.warn('showThermostatOnlineBoard is false or was not set');
         }

        // activeConsumption char
        this.showActiveConsumptionChart = engineeringConfig.showActiveConsumptionChart;
        if (!this.showActiveConsumptionChart) {
          console.warn('showActiveConsumptionChart is false or was not set');
        } else {
          this.activeConsumptionConfig = engineeringConfig.activeConsumptionsConfig;
        }

        // activeConsumption char
        this.showRelayPresenceChart = engineeringConfig.showRelayPresenceChart;
        if (!this.showRelayPresenceChart) {
          console.warn('showRelayPresenceChart is false or was not set');
        }

         this.showConsumptionCharts = engineeringConfig.showConsumptionCharts;
         if (!this.showConsumptionCharts) {
           console.warn('showConsumptionCharts is false or was not set');
         }

         this.showOccupancyCharts = engineeringConfig.showOccupancyCharts;
         if (!this.showOccupancyCharts) {
           console.warn('showOccupancyCharts is false or was not set');
         }

         this.showCoolingDemandChart = engineeringConfig.showCoolingDemandChart;
         if (!this.showCoolingDemandChart) {
           console.warn('showCoolingDemandChart is false or was not set');
         }
   

      } else {
        console.warn("in config file, 'engineering' is false or was not set");
      }
    }
  }

  buildDataSvgConfig() {
    const engineeringConfig = this.properties.engineering;
    if (engineeringConfig) {
      const dataSvgs = engineeringConfig.dataSvgs;
      if (dataSvgs) {
        dataSvgs.forEach(config => {
          this.dataSvgsConfig.push(config);
        });
      } else {
        console.warn("Did not find 'dataSvgs' in appConfigFile")
      }
    }
  }


  buildThermometerConfig() {
    this.thermometersConfig = [];

    const engineeringConfig = this.properties.engineering;

    if (engineeringConfig) {
      const thermometersConfig = engineeringConfig.thermometers;
      if (thermometersConfig) {
        thermometersConfig.forEach(config => {
          this.thermometersConfig.push(config);
        });
      } else {
        console.warn("Did not find 'thermometersConfig' in appConfigFile")
      }
    }

  }

  onCharClick(event) {
    this.showGridRooms = true;
    this.gridTitle = event.name;
    this.gridData = event.dataArray;
  }

  back() {
    this.showGridRooms = false;
  }

  onChangeStructureFilter(filtered){
    this.selectedFloor = filtered;
  }


}
