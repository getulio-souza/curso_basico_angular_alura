import { DataService, TraceType } from './../../services/data/data.service';
import { Component, SimpleChanges, Input, OnChanges, OnDestroy } from '@angular/core';
import { RealTime } from '../../abstracts/realTime';
import { TemperatureService } from '../../services/temperatureService/temperature.service';

const COLD_CHAMBER_ATTRIBUTES: Array<string> =
  [
    'temperature'
  ];

@Component({
  selector: 'app-cold-chamber',
  templateUrl: './cold-chamber.component.html',
  styleUrls: ['./cold-chamber.component.css']
})
export class ColdChamberComponent implements OnChanges, OnDestroy {

  @Input() properties;

  temperatureUomIsFahrenheit;
  realTime: RealTime;

  ownerId;

  coldChambersConfig = [];
  coldChambers = [];
  coldChambersMap: Map<string, number> = new Map();

  constructor(private dataService: DataService, private temperatureService: TemperatureService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.properties) {
      if (!this.properties) {
        // properties not loaded yet, nothing to do
        return;
      }

      this.ownerId = this.properties.propertyId;
      const engineering = this.properties.engineering;
      if (!engineering) {
        // no engineering property defined
        return;
      }

      this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
      this.coldChambersConfig = engineering.coldChambers;

      if (!this.realTime) {
        this.realTime = new RealTime();
        this.realTime.startGettingRealTimeData(() => {
          this.getData();
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }
  }

  getData() {
    // as we wanna all data from all property
    // so, tag is the same as ownerId
    this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId, TraceType.COLD_CHAMBER).subscribe((coldChambersData: any[]) => {

      this.coldChambers = [];
      this.coldChambersMap = new Map();

      this.coldChambersConfig.forEach(coldChamberConfig => {
        let id = coldChamberConfig['id'];
        let name = coldChamberConfig['name'];
        let thermometer = {};

        thermometer['id'] = id;
        thermometer['name'] = name;

        if (!name) {
          thermometer['name'] = id;
        }

        thermometer['value'] = null;
        this.coldChambersMap.set(id, this.coldChambers.length);
        this.coldChambers.push(thermometer);
      });


      for (let i = 0; i < coldChambersData.length; i++) {
        let currentColdChamberData = coldChambersData[i];
        let coldChamber = this.coldChambers[this.coldChambersMap.get(currentColdChamberData.deviceId)];

        // just to verify if we're receiving data from a device not configured in configs
        if (!coldChamber) {
          this.realTime.logNotConfigFound(currentColdChamberData, this.ownerId);
          continue;
        }

        let temperature = Math.round(currentColdChamberData['temperature'] * 10) / 10;
        coldChamber.temperature = temperature;
        coldChamber.temperatureLabel = this.temperatureService.buildTempLabels(temperature, this.temperatureUomIsFahrenheit);
        this.coldChambers[this.coldChambersMap.get(currentColdChamberData.deviceId)] = coldChamber;
   

      }
    }, (error) => {
      console.error(`Error trying to get real time values for coldChambers: `);
      console.error(error);
    });

  }

}
