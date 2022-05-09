import { TranslateService } from '@ngx-translate/core';

import { DataService, PeriodEnum } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Presence } from '@alis/proxper-base';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractWeek } from './../abstracts/abstractWeek';
import { NumericRoundService } from '../services/numericRound/numeric-round.service';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-occupancy-week-details',
  templateUrl: './occupancy-week-details.component.html',
  styleUrls: ['./occupancy-week-details.component.css']
})
export class OccupancyWeekDetailsComponent extends AbstractWeek implements OnInit {

  // chart configs
  options;
  data;

  energyGroupId;

  constructor(dateService: DateService,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tkoChartBuilder: TkoChartBuilderService,
    private translateService: TranslateService) {

    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe(params => {
        this.energyGroupId = params.get('energyGroupId');
        this.getData();
      });
  }

  back() {
    this.router.navigate(['engineering'], { relativeTo: this.activatedRoute.parent });
  }

  onStepBack(event) {
    this.oneStepBack();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 500,
        margin: {
          top: 50,
          right: 20,
          bottom: 60,
          left: 45
        },
        clipEdge: true,
        duration: 500,
        tooltips: true,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant('Day'),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(d); }
        },
        yAxis: {
          axisLabel: '%',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d) + "%";
          }
        },

        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.presenceInfo);
          });
        }
      }
    };
  }

  onChartClick(presenceInfo: Presence) {
    this.goDeeper(presenceInfo);
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();

    this.dataService.getOccupancyAndConsumptionList(this.energyGroupId,
                                      this.energyGroupId, 
                                      this.resolution,
                                      this.startDate,
                                      this.endDate,
                                      PeriodEnum.DAY_OF_WEEK,
                                      this.periodEntries)
                    .subscribe((presenceList: Presence[]) => {
                      this.translateService.get(['Occupancy', 'Sold']).subscribe((translations) => {
                        // translation loader is now ready
                        this.data = this.tkoChartBuilder.buildOccupancyData(presenceList, translations, this.resolution, PeriodEnum.DAY_OF_WEEK, this);
                      });
                    });

}

}
