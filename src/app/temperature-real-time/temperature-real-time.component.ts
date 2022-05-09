import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-temperature-real-time',
  templateUrl: './temperature-real-time.component.html',
  styleUrls: ['./temperature-real-time.component.css']
})
export class TemperatureRealTimeComponent implements OnInit {

  constructor() { }

  tempInside;
  tempOutside;

  ngOnInit() {
    this.getData();
  }

  getData() {
    const max = 30;
    const min = 16;

    this.tempInside = Math.floor(Math.random() * (max - min + 1) + min);
    this.tempOutside = 30;
  }
}
