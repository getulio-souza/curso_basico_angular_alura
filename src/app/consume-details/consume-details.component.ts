import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Consumption } from '@alis/proxper-base';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractThirtyDays } from './../abstracts/abstractThirtyDays';
import { RoundValueInfo } from '../services/numericRound/numeric-round.service';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-consume-details',
  templateUrl: './consume-details.component.html',
  styleUrls: ['./consume-details.component.css']
})
export class ConsumeDetailsComponent extends AbstractThirtyDays implements OnInit {


  energyGroupId;

  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: "Wh"
  };

  constructor(private activatedRoute: ActivatedRoute,
              public dateService: DateService,
              private dataService: DataService,
              private router: Router,
              private translateService: TranslateService,
              private tkoChartBuilder: TkoChartBuilderService) {
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
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
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

  onChartClick(info: Consumption) {
    this.goDeeper(info);
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.dataService.getOccupancyAndConsumptionList(this.energyGroupId,
                                        this.energyGroupId,
                                        this.resolution,
                                        this.startDate,
                                        this.endDate,
                                        null,
                                        null)
                    .subscribe((consumptionList: Consumption[]) => {
                       this.translateService.get(['Savings', 'HVAC Engaged']).subscribe((translations) => {
                              // translation loader is now ready
                              let res = this.tkoChartBuilder.buildConsumeData(consumptionList, translations, null, this);
                              this.data = res.data;
                              this.roundValueInfo = res.roundValueInfo;
                              this.reloadChartOptions();
                        });
                    });
  }

}
