import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'home-page-sold-info',
  templateUrl: './sold-info.component.html',
  styleUrls: ['./sold-info.component.less']
})
export class SoldInfoComponent implements OnInit {
  
  soldPercentage;
  occupancyPercentage;

  occupiedArray;
  unoccupiedArray;
  soldArray;
  unSoldArray;

  @Output() soldInfoDetails = new EventEmitter<any>();

  constructor() {
    this.getData();
    this.buildBarsArray();
  }

  ngOnInit() {
  }


  getData(){
    this.soldPercentage = Math.random()*100;
    this.occupancyPercentage = Math.random()*100;
  }

  buildBarsArray(){
    
    //unoccupiedArray is the complement of occupiedArray
    let occupiedArraySize = Math.round(this.occupancyPercentage/10);
    this.occupiedArray =  Array(occupiedArraySize).fill(1).map((x,i)=>i);
    this.unoccupiedArray =  Array(10-occupiedArraySize).fill(1).map((x,i)=>i);
    
    //unsold is the complement of sold
    let soldArraySize = Math.round(this.soldPercentage/10);;
    this.soldArray =  Array(soldArraySize).fill(1).map((x,i)=>i);
    this.unSoldArray =  Array(10 - soldArraySize).fill(1).map((x,i)=>i);
    
  }

  onAddButtonClick() {
    this.soldInfoDetails.emit();
  }
}
