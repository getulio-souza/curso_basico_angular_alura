import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { RealTime } from '../../abstracts/realTime';
import { TemperatureService } from '../../services/temperatureService/temperature.service';

@Component({
  selector: 'engineering-thermometers',
  templateUrl: './thermometers.component.html',
  styleUrls: ['./thermometers.component.less']
})
export class ThermometersComponent implements OnInit, OnChanges, OnDestroy {

  @Input() properties;
  @Input() thermometersConfig;

  temperatureUomIsFahrenheit;
  propertyId;

  thermometerMap = new Map();
  thermometers = [];
  realTime: RealTime;

  constructor(
    private dataService: DataService, private temperatureService: TemperatureService) {
  }

  ngOnChanges() {
    if (this.thermometersConfig) {
      this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
      this.propertyId = this.properties.propertyId;
      if (!this.realTime) {
        this.realTime = new RealTime();
        this.realTime.startGettingRealTimeData(() => {
          this.getData();
        });
      }
    }
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
  }

  getData() {
    //REAL DATA
    this.dataService.getStatesByOwnerAndTagAndTraceType(this.propertyId, this.propertyId, TraceType.THERMOMETER).subscribe((thermometersData) => {
      
      this.thermometers = [];
      this.thermometerMap = new Map();

      this.thermometersConfig.forEach(thermometerConfig => {
        let id = thermometerConfig['id'];
        let name = thermometerConfig['name'];
        let thermometer = {};

        thermometer['id'] = id;
        thermometer['name'] = name;

        if (!name) {
          thermometer['name'] = id;
        }

        thermometer['value'] = null;
        this.thermometerMap.set(id,this.thermometers.length);
        this.thermometers.push(thermometer);

      });

      for (let i = 0; i < thermometersData.length; i++) {
        let currentThermometerData = thermometersData[i];
        let thermometer = this.thermometers[this.thermometerMap.get(currentThermometerData.deviceId)];

        // just to verify if we're receiving data from a device not configured in configs
        if (!thermometer) {
          this.realTime.logNotConfigFound(currentThermometerData, this.propertyId);
          continue;
        }
        let temperature = Math.round(currentThermometerData['temperature'] * 10) / 10; 
        thermometer.temperature = temperature;
        thermometer.temperatureLabel = this.temperatureService.buildTempLabels(temperature,this.temperatureUomIsFahrenheit);
        this.thermometers[this.thermometerMap.get(currentThermometerData.deviceId)] = thermometer;
      }
    },
      (error) => {
        console.error("Error trying to get thermometer data");
        console.error(error);
      })
  }

  logError(msg) {
    console.error(msg);
  }

}
