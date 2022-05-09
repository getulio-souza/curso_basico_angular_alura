import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.less']
})
export class RoomDetailsComponent implements OnInit {


  roomNumber = 2103;

  constructor() {
    
  }

  ngOnInit() {
  }

}
