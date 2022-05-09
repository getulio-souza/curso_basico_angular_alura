import { DataService, TraceType } from './../../services/data/data.service';
import { DeviceDataService } from './../../services/device-data/device-data.service';
import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { environment } from './../../../environments/environment';
import { RealTime } from '../../abstracts/realTime';

const POWER_ATTRIBUTES: Array<string> =
  [
    'active-power'
  ];

@Component({
  selector: 'app-power-real-time',
  templateUrl: './power-real-time.component.html',
  styleUrls: ['./power-real-time.component.css']
})
export class PowerRealTimeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() properties;
  ownerId;
  powersConfig = [];
  powers = [];
  powersMap: Map<string,number> = new Map();

  realTime: RealTime;

  constructor(
    private dataService: DataService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
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
      this.powersConfig = engineering.power;

      this.ownerId = this.properties.propertyId;

      if (!this.realTime) {
        this.realTime = new RealTime();
        this.realTime.startGettingRealTimeData(() => {
          this.getData();
        });
      }

    }
  }

  getData() {

    //REAL DATA
    this.dataService.getStatesByOwnerAndTagAndTraceType(this.ownerId, this.ownerId,TraceType.WATTMETER).subscribe((powersData: any[]) => {
      this.powers = [];;

      this.powersConfig.forEach(powerConfig => {
        let id = powerConfig['id'];
        let name = powerConfig['name'];
        let thermometer = {};

        thermometer['id'] = id;
        thermometer['name'] = name;

        if (!name) {
          thermometer['name'] = id;
        }

        thermometer['value'] = null;
        this.powersMap.set(id,this.powers.length);
        this.powers.push(thermometer);

      });


      for (let i = 0; i < powersData.length; i++) {

        let currentPowerData = powersData[i];
        let currentPower = this.powers[this.powersMap.get(currentPowerData.deviceId)];

        // just to verify if we're receiving data from a device not configured in configs
        if (!currentPower) {
          this.realTime.logNotConfigFound(currentPowerData, this.ownerId);
          continue;
        }

        let value = Math.round(currentPowerData['active-power'] * 100) / 100;
        currentPower.value = value;
        this.powers[this.powersMap.get(currentPowerData.deviceId)] = currentPower;

      }
    },
      (error) => {
        console.error("Error trying to get wattmeter data");
        console.error(error);
      })
  }

  logError(msg) {
    console.error(msg);
  }




}
