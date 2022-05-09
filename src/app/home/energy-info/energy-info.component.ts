import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'home-page-energy-info',
  templateUrl: './energy-info.component.html',
  styleUrls: ['./energy-info.component.less']
})
export class EnergyInfoComponent implements OnInit {
  totalSpent;

  @Output() consumeInfoDetails = new EventEmitter<any>();
  
  constructor() {

    this.getDataFromServer();
  }

  ngOnInit() {
  }

  getDataFromServer() {
    this.totalSpent = 10274;

  }

  onAddButtonClick() {
    this.consumeInfoDetails.emit();
  }

}
