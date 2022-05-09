import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'home-summary-info',
  templateUrl: './summary-info.component.html',
  styleUrls: ['./summary-info.component.less']
})
export class SummaryInfoComponent implements OnInit {

  @Input() summary;
  @Input() showDndBars;
  @Input() showConsumptionSummaryData;
  @Input() showOccupancyBars;
  @Input() showSoldBars;

  constructor() { }

  ngOnInit() {
  }

}
