
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AbstractThirtyDays } from '../abstracts/abstractThirtyDays';
import { Consumption } from '@alis/proxper-base';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { DateService } from '../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { RoundValueInfo } from '../services/numericRound/numeric-round.service';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-graph-consume-summary',
  templateUrl: './graph-consume-summary.component.html',
  styleUrls: ['./graph-consume-summary.component.css']
})
export class GraphConsumeSummaryComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() energyGroupId: string;
  @Input() occupancyAndConsumeList = [];

  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: "Wh"
  };
  
  constructor(dateService: DateService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private tkoChartBuilder: TkoChartBuilderService,
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
          right: 0
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant('Day'),
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: that.roundValueInfo.uom,
          axisLabelDistance: -15,
          showMaxMin: false,
          tickFormat: function (value) {
            return value;
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
    this.route.navigate(["consumeDetails/" + this.energyGroupId], { relativeTo: this.activatedRoute.parent });
  }


  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.translateService.get(['Savings', 'HVAC Engaged']).subscribe((translations) => {
      // translation loader is now ready
      let res = this.tkoChartBuilder.buildConsumeData(this.occupancyAndConsumeList, translations, null, this);
      this.data = res.data;
      this.roundValueInfo = res.roundValueInfo;
      this.reloadChartOptions();
    });
  }
}
