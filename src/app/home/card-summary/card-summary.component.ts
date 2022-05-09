import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'home-card-summary',
  templateUrl: './card-summary.component.html',
  styleUrls: ['./card-summary.component.less']
})
export class CardSummaryComponent implements OnInit {

  @Input() summary;
  @Input() showDndBars;
  @Input() showConsumptionSummaryData;
  @Input() showOccupancyBars;
  @Input() showSoldBars;

  constructor() { }

  ngOnInit() {
    
  }

}
