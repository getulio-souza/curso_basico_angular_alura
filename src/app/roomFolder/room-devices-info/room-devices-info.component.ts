import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'room-folder-devices-info',
  templateUrl: './room-devices-info.component.html',
  styleUrls: ['./room-devices-info.component.less']
})
export class RoomDevicesInfoComponent implements OnInit {
  
  currentTemp;
  setPoint;
  mode;
  fanspeed;
  hasPresence;

  switchesOn;
  switchesOff;
  dimmersOn;
  dimmersOff;
  
  constructor() {
    this.getData();
   }

  ngOnInit() {
  }

  getData() {
    this.currentTemp = 18;
    this.setPoint = 19;
    this.mode = "cold";
    this.fanspeed = "medium";
    this.hasPresence = true;

    this.switchesOn = 3;
    this.switchesOff = 4;
    this.dimmersOn = 7;
    this.dimmersOff = 7;
  }

}
