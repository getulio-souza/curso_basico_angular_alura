import { Component, OnInit, SimpleChanges, Input, OnChanges, OnDestroy } from '@angular/core';
import {DataService, TraceType} from '../../services/data/data.service';
import { RealTime } from '../../abstracts/realTime';
import { TemperatureService } from '../../services/temperatureService/temperature.service';

@Component({
  selector: 'engineering-advanced-cold-chamber',
  templateUrl: './advanced-cold-chamber.component.html',
  styleUrls: ['./advanced-cold-chamber.component.less']
})
export class AdvancedColdChamberComponent implements OnInit, OnChanges, OnDestroy {

  @Input() properties;
  temperatureUomIsFahrenheit;
  ownerId;
  
  realTime: RealTime;
  advancedColdChamberConfig = [];
  advancedColdChambers = [];

  constructor(private dataService: DataService, private temperatureService: TemperatureService) {
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.realTime.clearInterval();
  }

  getData() {
    this.getAdvancedColdChamberData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties) {
      if (!this.properties) {
        // properties not loaded yet, nothing to do
        return;
      }
      const engineering = this.properties.engineering;
      if (!engineering) {
        // no engineering property defined
        return;
      }

      this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;

      const coldChambersFromConfig = engineering.advancedColdChambers;
      if (!coldChambersFromConfig || !coldChambersFromConfig[0]) {
        // we must have at least one coldChambers defined
        return;
      }

      this.advancedColdChamberConfig = coldChambersFromConfig;

      this.ownerId = this.properties.propertyId;

      if (!this.realTime) {
        this.realTime = new RealTime();
        this.realTime.startGettingRealTimeData(() => {
          this.getData();
        });
      }

    }
  }


  getAdvancedColdChamberData() {
    // as we wanna all data from all property
    // so, tag is the same as ownerId
    this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId, TraceType.ADVANCED_COLD_CHAMBER).subscribe((coldChambersInfo: any[]) => {
      this.advancedColdChambers = [];

      for (let i = 0; i < coldChambersInfo.length; i++) {
        let currentAdvancedColdChamber = coldChambersInfo[i];

        let negativeChamberDoorTemperature = Math.round(currentAdvancedColdChamber['negative-chamber-door-temperature'] * 10) / 10;
        let positiveChamberTemperature = Math.round(currentAdvancedColdChamber['positive-chamber-temperature'] * 10) / 10;
        let negativeChamberRearTemperature = Math.round(currentAdvancedColdChamber['negative-chamber-rear-temperature'] * 10) / 10;
        let negativeChamberDhtTemperature = Math.round(currentAdvancedColdChamber['negative-chamber-dht-temperature'] * 10) / 10;
        let negativeChamberHumidity = 100 * Math.round(currentAdvancedColdChamber['negative-chamber-humidity'] * 100) / 100;
        let doorSensor = currentAdvancedColdChamber['doorsensor'];

        currentAdvancedColdChamber.negativeChamberDoorTemperature = negativeChamberDoorTemperature;
        currentAdvancedColdChamber.negativeChamberDoorTemperatureLabel = this.temperatureService.buildTempLabels(negativeChamberDoorTemperature,this.temperatureUomIsFahrenheit);
        
        currentAdvancedColdChamber.positiveChamberTemperature = positiveChamberTemperature,this.temperatureUomIsFahrenheit;
        currentAdvancedColdChamber.positiveChamberTemperatureLabel = this.temperatureService.buildTempLabels(positiveChamberTemperature,this.temperatureUomIsFahrenheit);
        
        currentAdvancedColdChamber.negativeChamberRearTemperature = negativeChamberRearTemperature,this.temperatureUomIsFahrenheit;
        currentAdvancedColdChamber.negativeChamberRearTemperatureLabel = this.temperatureService.buildTempLabels(negativeChamberRearTemperature,this.temperatureUomIsFahrenheit);
        
        currentAdvancedColdChamber.negativeChamberDhtTemperature = negativeChamberDhtTemperature,this.temperatureUomIsFahrenheit;
        currentAdvancedColdChamber.negativeChamberDhtTemperatureLabel = this.temperatureService.buildTempLabels(negativeChamberDhtTemperature,this.temperatureUomIsFahrenheit);
        
        currentAdvancedColdChamber.negativeChamberHumidity = negativeChamberHumidity;
        currentAdvancedColdChamber.negativeChamberHumidityLabel = negativeChamberHumidity + "%";
        
        currentAdvancedColdChamber.doorSensor = doorSensor;
        currentAdvancedColdChamber.doorSensorLabel = doorSensor == 0 ? 'Closed' : 'Open';

  
        let deviceConfig = this.realTime.getDeviceConfig(this.advancedColdChamberConfig, currentAdvancedColdChamber);

        if (!deviceConfig) {
          this.realTime.logNotConfigFound(currentAdvancedColdChamber, this.ownerId);
          continue;
        }

        currentAdvancedColdChamber.name = deviceConfig.name;

        if (!currentAdvancedColdChamber.name) {
          currentAdvancedColdChamber.name = deviceConfig.id;
        }

        this.advancedColdChambers.push(currentAdvancedColdChamber);
      }
    }, (error) => {
      console.error(`Error trying to get real time values for coldChambers: `);
      console.error(error);
    });
  }


  getBackgroundColor(value) {

    if(isNaN(value)){
      return 'no-data';
    }

    if (value < -15) {
      return 'level1';
    }
    if (value < -10) {
      return 'level2';
    }

    if (value < 0) {
      return 'level3';
    }

    if (value < 10) {
      return 'level4';
    }

    return 'level5'

  }


}
