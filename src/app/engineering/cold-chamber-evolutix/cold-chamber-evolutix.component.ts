import { DeviceDataService } from './../../services/device-data/device-data.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cold-chamber-evolutix',
  templateUrl: './cold-chamber-evolutix.component.html',
  styleUrls: ['./cold-chamber-evolutix.component.css']
})
export class ColdChamberEvolutixComponent implements OnInit {

  coldChamberEvolutixId;

  coldChamber;
  isDoorOpen: boolean;
  isCompressorOn: boolean;
  isEvaporatorOn: boolean;
  energyConsumption: number;


  constructor(private deviceDataService: DeviceDataService) {
    this.coldChamber = {};
    this.coldChamberEvolutixId = environment.realTimeDevices.coldChamberEvolutixId;
    }

  ngOnInit() {
    this.getData();
  }


  getData() {

    this.deviceDataService.getDeviceData(this.coldChamberEvolutixId).then((res) => {
      this.buildData(res);
    });

  }

  buildData(response) {


    this.coldChamber['frontTemp'] = response.frontTemp;
    this.coldChamber['backRoomTemp'] = response.backRoomTemp;
    this.coldChamber['foodSurfaceTemp'] = response.foodSurfaceTemp;
    this.coldChamber['airTemp'] = response.airTemp;
    this.coldChamber['isCompressorOn'] = response.isCompressorOn;
    this.coldChamber['isDoorOpen'] = response.isDoorOpen;
    this.coldChamber['isEvaporatorOn'] = response.isEvaporatorOn;
    this.coldChamber['humidity'] = response.humidity;

  }

}
