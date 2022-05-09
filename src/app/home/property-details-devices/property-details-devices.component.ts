import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'home-page-property-details-devices',
  templateUrl: './property-details-devices.component.html',
  styleUrls: ['./property-details-devices.component.less']
})
export class PropertyDetailsDevicesComponent implements OnInit {

  data = [];
  @Output() onCloseButtonClickEmitter = new EventEmitter<any>();
  constructor() {
    this.getData();
  }

  ngOnInit() {
  }

  onCloseButtonClick() {
    this.onCloseButtonClickEmitter.emit();
  }
  getData(){
    this.data = [
      {
        name: "Termostatos Inteligentes modelo Telken Plus",
        number: 879
      },{
        name: "Switches Luminilight",
        number: 940
      },
      {
        name: "Dimmers Luminilight",
        number: 520
      },
      {
        name: "Cortinas Happy Shadow",
        number: 870
      },
      {
        name: "Televisores samsung 50'",
        number: 560
      },{
        name: "Televisores samsung 70'",
        number: 840
      },
      {
        name: "Freezers comodore a54 vertical plus",
        number: 42
      },
      {
        name: "Ar-condicionado premiere II",
        number: 1450
      },{
        name: "Modemns Adapt Link 3 antenas",
        number: 1569
      },
      {
        name: "Micro-ondas premiere V",
        number: 213
      },
      {
        name: "Tablets Samsung slim line 46AC7",
        number: 258
      },{
        name: "Micro-systems premiere modelo ftl (follow the leader)",
        number: 54
      },
    ]
  }
}
