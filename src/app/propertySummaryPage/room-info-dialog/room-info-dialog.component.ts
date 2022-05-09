import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'property-summary-room-info-dialog',
  templateUrl: './room-info-dialog.component.html',
  styleUrls: ['./room-info-dialog.component.less']
})
export class RoomInfoDialogComponent implements OnInit {

  @Input() selectedRoom;
  
  isCelsius = true;

  constructor() { }

  ngOnInit() {
    
  }

  changeMetric(metric) {
    if (metric === 'c') {
      this.isCelsius = true;
    } else if (metric === 'f') {
      this.isCelsius = false;
    } else {
      //default is celsius
      this.isCelsius = true;
    }
  }

  


}
