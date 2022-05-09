import { Component, Input, OnChanges } from '@angular/core';
import { AbstractWeek } from '../../abstracts/abstractWeek';
import { DateService } from '../../services/date/date.service';
import { DataService, PeriodEnum } from '../../services/data/data.service';

@Component({
  selector: 'app-week-summary',
  templateUrl: './week-summary.component.html',
  styleUrls: ['./week-summary.component.less']
})
export class WeekSummaryComponent extends AbstractWeek implements OnChanges {

  @Input() energyGroupId;
  @Input() showConsumptionCharts = false;
  @Input() showOccupancyCharts = false;
  
  occupancyAndConsumeList = [];

  constructor(dateService: DateService, private dataService: DataService) {
    super(dateService)
  }

  ngOnChanges() {
    if (!this.energyGroupId) {
      return;
    }

    this.getData();
  }

  getData() {
    this.dataService.getOccupancyAndConsumptionList(
      this.energyGroupId,
      this.energyGroupId,
      'day',
      this.startDate,
      this.endDate,
      PeriodEnum.DAY_OF_WEEK,
      null
    ).subscribe((response) => {
      this.occupancyAndConsumeList = response;
    })
  }

}
