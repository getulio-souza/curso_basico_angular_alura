import { TranslateService } from '@ngx-translate/core';
import { DataService, PeriodEnum } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AbstractWeek } from './../abstracts/abstractWeek';
import { Presence } from '@alis/proxper-base';
import { Router, ActivatedRoute } from '@angular/router';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';


@Component({
  selector: 'app-graph-occupancy-week',
  templateUrl: './graph-occupancy-week.component.html',
  styleUrls: ['./graph-occupancy-week.component.css']
})
export class GraphOccupancyWeekComponent extends AbstractWeek implements OnInit, OnChanges {

  @Input() energyGroupId: string;
  @Input() occupancyAndConsumeList = [];

  constructor(dateService: DateService,
    private route: Router,
    private tkoChartBuilder: TkoChartBuilderService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService) {
    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }
  ngOnInit() {
  }

  ngOnChanges() {
    this.getData();
  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 300,
        margin: {
          top: 0,
          right: 20,
          left: 45
        },
        clipEdge: true,
        duration: 500,
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
          showMaxMin: false,
          tickFormat: function (d) {
            return Math.round(d) + '%';
          }
        },

        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.consumptionInfo);
          });
        }
      }
    };
  }

  onChartClick(presenceInfo: Presence) {
    this.route.navigate(["occupancyWeekDetails/" + this.energyGroupId], { relativeTo: this.activatedRoute.parent });
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.translateService.get(['Occupancy', 'Sold']).subscribe((translations) => {
      // translation loader is now ready
      this.data = this.tkoChartBuilder.buildOccupancyData(this.occupancyAndConsumeList, translations, this.resolution, PeriodEnum.DAY_OF_WEEK, this);
    });
  }


}
