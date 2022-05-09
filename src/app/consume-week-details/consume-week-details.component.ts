import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Consumption } from '@alis/proxper-base';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractWeek } from './../abstracts/abstractWeek';
import { RoundValueInfo } from '../services/numericRound/numeric-round.service';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-consume-week-details',
  templateUrl: './consume-week-details.component.html',
  styleUrls: ['./consume-week-details.component.css']
})
export class ConsumeWeekDetailsComponent extends AbstractWeek implements OnInit {

  energyGroupId;
  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: "Wh"
  };
  
  constructor(public dateService: DateService,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tkoChartBuilder: TkoChartBuilderService,
    private translateService: TranslateService){
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

   onStepBack(event) {
    this.oneStepBack();
  }
  
  onChartClick(consumptionInfo: Consumption) {
    this.goDeeper(consumptionInfo);
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.dataService.getOccupancyAndConsumptionList(this.energyGroupId,
                                        this.energyGroupId, 
                                        this.resolution,
                                        this.startDate,
                                        this.endDate,
                                        this.period,
                                        this.periodEntries)
                    .subscribe((consumptionList: Consumption[]) => {
                          this.translateService.get(['Savings', 'HVAC Engaged']).subscribe((translations) => {
                          // translation loader is now ready
                          let res = this.tkoChartBuilder.buildConsumeData(consumptionList, translations,this.period, this);
                          this.data = res.data;
                          this.roundValueInfo = res.roundValueInfo;
                          this.reloadChartOptions();
                        });
                    });
  }

}
