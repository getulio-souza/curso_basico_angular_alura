import { Consumption } from '@alis/proxper-base';
import { TranslateService } from '@ngx-translate/core';
import { DateService } from './../../services/date/date.service';
import { FakeDataService } from './../../services/fake-data/fake-data.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';

@Component({
  selector: 'home-page-consume-info-chart',
  templateUrl: './consume-info-chart.component.html',
  styleUrls: ['./consume-info-chart.component.css']
})
export class ConsumeInfoChartComponent implements OnInit {

  options;
  data;

  @Output() onCloseButtonClickEmitter = new EventEmitter<any>();

  constructor(private fakeDataService: FakeDataService, dateService: DateService, private translateService: TranslateService) {

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });

  }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges() {
    this.getData();
  }

  onCloseButtonClick() {
    this.onCloseButtonClickEmitter.emit();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'lineChart',
        height: 500,
        margin: {
          top: 0,
          right: 0
        },
        clipEdge: true,
        duration: 1500,
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant('Day'),
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'kWh',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d);
          }
        },
        callback: function (chart) {
          chart.lines.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.consumptionInfo);
          });
        }
      }
    };
  }

  onChartClick(data) {
    console.log(data);
  }


  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.getFakeData();
  }

  getFakeData() {
    let dataParams = {};
    dataParams['resolution'] = 'day';
    let consumptionList = this.fakeDataService.getConsumptionList(dataParams);
    this.data = this.buildConsumeDataSummary(consumptionList);

  }

  buildConsumeDataSummary(comsumptions: Array<Consumption>) {
    const Kwhs = [];
    let result: Consumption;
    let date: Date;
    let khwValue;
    
    for (let i = 0; i < comsumptions.length; i++) {
      result = comsumptions[i];
      date = new Date(result.key);
      khwValue = result['Kwh'];
      Kwhs.push({ x: date.getDate(), y: khwValue, consumptionInfo: result });

    }
    return [
      {
        key: 'Khw',
        values: Kwhs,
        color: '#ef5350'
      }
    ];
  }

}
