import { TranslateService } from '@ngx-translate/core';
import { DataService, PeriodEnum } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AbstractWeek } from './../abstracts/abstractWeek';
import { Consumption } from '@alis/proxper-base';
import { Router, ActivatedRoute } from '@angular/router';
import { RoundValueInfo } from '../services/numericRound/numeric-round.service';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-graph-consume-week',
  templateUrl: './graph-consume-week.component.html',
  styleUrls: ['./graph-consume-week.component.css']
})
export class GraphConsumeWeekComponent extends AbstractWeek implements OnInit, OnChanges {

  @Input() energyGroupId: string;
  @Input() occupancyAndConsumeList = [];

  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: "Wh"
  };;
  
  constructor(dateService: DateService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private tkoChartBuilder: TkoChartBuilderService,
    private translateService: TranslateService){
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
        clipEdge: false,
        duration: 500,
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant('Day'),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(d); }
        },
        yAxis: {
          axisLabel: that.roundValueInfo.uom,
          axisLabelDistance: -15,
          showMaxMin: false,
          tickFormat: function (d) {
            return d;
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

  onChartClick(consumptionInfo: Consumption) {
    this.route.navigate(["consumeWeekDetails/" + this.energyGroupId], { relativeTo: this.activatedRoute.parent });
  }


  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.translateService.get(['Savings', 'HVAC Engaged']).subscribe((translations) => {
      // translation loader is now ready
      let res = this.tkoChartBuilder.buildConsumeData(this.occupancyAndConsumeList, translations, PeriodEnum.DAY_OF_WEEK, this);;
      this.data = res.data;
      this.roundValueInfo = res.roundValueInfo;
      this.reloadChartOptions();
    });


  }


}
