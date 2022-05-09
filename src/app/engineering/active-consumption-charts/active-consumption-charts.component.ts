import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'enginnering-active-consumption-charts',
  templateUrl: './active-consumption-charts.component.html',
  styleUrls: ['./active-consumption-charts.component.less']
})
export class ActiveConsumptionChartsComponent implements OnInit {

  @Input() activeConsumptionsConfig;

  constructor() { }

  ngOnInit() {
  }

}
