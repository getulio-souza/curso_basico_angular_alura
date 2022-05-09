import { DataService, TraceType } from './../../services/data/data.service';
import { DeviceDataService } from './../../services/device-data/device-data.service';
import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy, ɵisListLikeIterable } from '@angular/core';
import { RealTime } from '../../abstracts/realTime';
import { map, throwIfEmpty } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { TemperatureService } from '../../services/temperatureService/temperature.service';

const CHILLER_ATTRIBUTES: Array<string> =
  [
    'entering-condensing-water-temperature',
    'leaving-condensing-water-temperature',
    'entering-cool-water-temperature',
    'leaving-cool-water-temperature'
  ];

const THERMOMETER_ATTRIBUTES: Array<string> = [
  'temperature'
]

const HYGROMETER_ATTRIBUTES: Array<string> = [
  'humidity'
]

@Component({
  selector: 'engineering-chiller',
  templateUrl: './chiller.component.html',
  styleUrls: ['./chiller.component.css']
})

export class ChillerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() chillerConfig;
  @Input() propertyId;
  @Input() temperatureUomIsFahrenheit;
  ownerId;

  realTime: RealTime;

  chillers = [];

  chillersData;
  hygrometersData;
  thermometersData;

  temperatures = [];

  temperaturesMap = new Map<String, number>();


  constructor(
    private dataService: DataService,
    private temperatureService: TemperatureService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chillerConfig) {
      if (!this.chillerConfig) {
        // properties not loaded yet, nothing to do
        return;
      }

      this.temperatureUomIsFahrenheit = this.temperatureUomIsFahrenheit;

      this.ownerId = this.propertyId;

      if (!this.realTime) {
        this.realTime = new RealTime();
        this.buildTemperaturesFromConfig();
        this.realTime.startGettingRealTimeData(() => {
          this.getData();
        });
      }

    }
  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }
  }

  buildTemperaturesFromConfig() {
    if (this.chillerConfig) {
      let temperaturesConfig = this.chillerConfig.temperatures;
      let customTemperaturesConfig = this.chillerConfig.customTemperatures;

      let temperature;

      //temperatures
      if (temperaturesConfig) {
        temperaturesConfig.forEach(temperatureConfig => {
          temperature = {};
          temperature["id"] = temperatureConfig.attribute;
          temperature["name"] = temperatureConfig.name;
          temperature["alert"] = temperatureConfig.alert;
          temperature["alertValue"] = temperatureConfig.alertValue;
          this.temperaturesMap.set(temperatureConfig.attribute, this.temperatures.length);
          this.temperatures.push(temperature)
        });
      }


      //customTemperatures
      if (customTemperaturesConfig) {
        customTemperaturesConfig.forEach(customTemperatureConfig => {
          temperature = {};
          temperature["id"] = customTemperatureConfig.id;
          temperature["name"] = customTemperatureConfig.name;
          temperature["alert"] = customTemperatureConfig.alert;
          temperature["alert"] = customTemperatureConfig.alert;
          temperature["alertValue"] = customTemperatureConfig.alertValue;
          this.temperaturesMap.set(customTemperatureConfig.id, this.temperatures.length);
          this.temperatures.push(temperature)
        });
      }
    }

  }


  getData() {
    forkJoin(this.getChillersData(),
      this.getHygrometersData(),
      this.getThermometerData()).subscribe(
        (res) => {
          //at this point we have already data on
          // chillersData
          // hygrometersData
          // thermometersData

          this.chillers = [];

          this.chillersData = res[0];
          this.hygrometersData = res[1];
          this.thermometersData = res[2];


          // lets iterate over each chiller from chillers data
          for (let i = 0; i < this.chillersData.length; i++) {
            let currentChiller = this.chillersData[i];

            // chiller config
            let chillerConfig = this.realTime.getDeviceConfig(new Array(this.chillerConfig), currentChiller);
            if (!chillerConfig) {
              this.realTime.logNotConfigFound(currentChiller, this.ownerId);
              continue;
            }
            currentChiller.name = chillerConfig.name;
            if (!currentChiller.name) {
              currentChiller.name = chillerConfig.id;
            }


            //building thermometer data definied in config
            this.thermometersData.forEach(thermometer => {
              let pos = this.temperaturesMap.get(thermometer.deviceId);
              if (pos != null) {
                let temp = Math.round(thermometer.temperature * 10) / 10;
                this.temperatures[pos]['value'] = temp;
                this.temperatures[pos]['valueLabel'] = this.temperatureService.buildTempLabels(temp, this.temperatureUomIsFahrenheit);
              }
            });

            // building temperatures data based on chiller
            for (var attribute in currentChiller) {
              if (!currentChiller.hasOwnProperty(attribute)) { continue; };
              let pos = this.temperaturesMap.get(attribute);
              if (pos != null) {
                let temp = Math.round(currentChiller[attribute] * 10) / 10;
                this.temperatures[pos]['value'] = temp;
                this.temperatures[pos]['valueLabel'] = this.temperatureService.buildTempLabels(temp, this.temperatureUomIsFahrenheit);
              }
            }

            //hygrometer - should be displayed in the bottom
            let hygrometer = this.getHygrometer(chillerConfig);
            currentChiller.hygrometer = {};
            if (hygrometer) {
              let externalHumidity = Math.round(hygrometer['humidity'] * 10) / 10;
              currentChiller.hygrometer.externalHumidity = externalHumidity;
              currentChiller.hygrometer.externalHumidityLabel = externalHumidity + "%";
            }

            //thermometer - should be displayed in the bottom
            let thermometer = this.getThermometer(chillerConfig);
            currentChiller.thermometer = {};
            if (thermometer) {
              let tempOutside = Math.round(thermometer['temperature'] * 10) / 10;
              currentChiller.thermometer.tempOutside = tempOutside;
              currentChiller.thermometer.tempOutsideLabel = this.temperatureService.buildTempLabels(tempOutside, this.temperatureUomIsFahrenheit);
            }

            this.chillers.push(currentChiller);
          }


          if (this.chillers.length == 0) {
            //just to show an empty card
            //if no data was received
            this.chillers.push({});
          }
        },
        (error) => {
          console.log("error trying to get chiller, hygrometer or thermoter data");
          console.error(error);
        });

  }

  getChillersData() {
    return this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId,TraceType.CHILLER).pipe(map((res) => {
      return res;
    }));
  }

  getHygrometersData() {
    return this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId, TraceType.HYGROMETER).pipe(map((res) => {
      return res;
    }));
  }

  getThermometerData() {
    return this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId, TraceType.THERMOMETER).pipe(map((res) => {
      return res;
    }));
  }

  getHygrometer(chillerConfig) {

    for (let i = 0; i < this.hygrometersData.length; i++) {
      let currentHygrometer = this.hygrometersData[i];

      if (currentHygrometer.deviceId === chillerConfig.hygrometerId) {
        return currentHygrometer;
      }
    }

    return null;
  }

  getThermometer(chillerConfig) {
    for (let i = 0; i < this.thermometersData.length; i++) {
      let currentThermometer = this.thermometersData[i];

      if (currentThermometer.deviceId === chillerConfig.thermometerId) {
        return currentThermometer;
      }
    }

    return null;
  }
}
