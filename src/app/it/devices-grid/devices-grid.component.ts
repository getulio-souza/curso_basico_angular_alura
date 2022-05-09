import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'it-devices-grid',
  templateUrl: './devices-grid.component.html',
  styleUrls: ['./devices-grid.component.less']
})
export class DevicesGridComponent implements OnInit {

  @Input() devices;
  @Output() onBackClickEmittter = new EventEmitter();

  cols = [
    { field: 'unitName', header: 'Unit name' },
    { field: 'deviceType', header: 'Device Type' },
    { field: 'deviceTemplate', header: 'Device Template' },
    { field: 'online', header: 'Online' },
    { field: 'timestamp', header: 'Last Updated' }
  ];

  constructor() { }

  ngOnInit() {
  }

  back() {
    this.onBackClickEmittter.emit({});
  }

}