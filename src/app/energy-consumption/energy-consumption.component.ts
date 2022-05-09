import { environment } from './../../environments/environment';
import { DeviceDataService } from './../services/device-data/device-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-energy-consumption',
  templateUrl: './energy-consumption.component.html',
  styleUrls: ['./energy-consumption.component.css']
})
export class EnergyConsumptionComponent implements OnInit {

  geralMainBuildingId;
  geralAnnexBuildingId;

  geralMainBuilding;
  geralAnnexBuilding;

  constructor(private deviceDataService: DeviceDataService) {
    this.geralMainBuildingId = environment.realTimeDevices.geralMainBuildingId;
    this.geralAnnexBuildingId = environment.realTimeDevices.geralAnnexBuildingId;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {

    // main building
    this.deviceDataService.getDeviceData(this.geralMainBuildingId).then((res) => {
       this.geralMainBuilding = res.power;
    });

    // annex building
    this.deviceDataService.getDeviceData(this.geralAnnexBuildingId).then((res) => {
      this.geralAnnexBuilding = res.power;
    });
  }


}
