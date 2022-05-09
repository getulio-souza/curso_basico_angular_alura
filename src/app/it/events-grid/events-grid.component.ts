import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'it-events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.less']
})
export class EventsGridComponent implements OnInit {

  @Input() events;
  @Output() onBackClickEmittter = new EventEmitter();

  cols = [
    { field: 'deviceId', header: 'Device Id' },
    { field: 'unitName', header: 'Unit name' },
    { field: 'type', header: 'Event Type' },
    { field: 'deviceType', header: 'Device Type' },
    { field: 'timestamp', header: 'Last Updated' }
  ];


  constructor() { }

  ngOnInit() {
  }

  back() {
    this.onBackClickEmittter.emit({});
  }

}
