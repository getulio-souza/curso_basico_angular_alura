import { Component, Input, OnChanges } from '@angular/core';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { DateService } from '../../services/date/date.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-thirty-days-summary',
  templateUrl: './thirty-days-summary.component.html',
  styleUrls: ['./thirty-days-summary.component.less']
})
export class ThirtyDaysSummaryComponent extends AbstractThirtyDays implements OnChanges {


  @Input() energyGroupId;
  
  @Input() showConsumptionCharts = false;
  @Input() showOccupancyCharts = false;

  occupancyAndConsumeList = [];

  constructor(dateService: DateService, private dataService: DataService) {
    super(dateService);
  }

  ngOnChanges() {
    if(!this.energyGroupId){
      return ;
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
      null,
      null).subscribe((response) => {
        this.occupancyAndConsumeList = response;
      })
  }

}
