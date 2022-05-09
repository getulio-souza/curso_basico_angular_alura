import { TranslateService } from '@ngx-translate/core';
import { FakeDataService } from './../../services/fake-data/fake-data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'home-page-sold-info-chart',
  templateUrl: './sold-info-chart.component.html',
  styleUrls: ['./sold-info-chart.component.less']
})
export class SoldInfoChartComponent implements OnInit {

  options;
  data;

  @Output() onCloseButtonClickEmitter = new EventEmitter<any>();

  constructor(private fakeDataService: FakeDataService, private translateService: TranslateService) {

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });

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
          axisLabel: '%',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d) + '%';
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

  ngOnInit() {
    this.getData();
  }

  ngOnChanges() {
    this.getData();
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.getFakeData();
  }

  onCloseButtonClick() {
    this.onCloseButtonClickEmitter.emit();
  }

  onChartClick(data) {
    console.log("chart has been clicked");
    console.log(data);
  }

  getFakeData() {
    let dataParams = {};
    dataParams['resolution'] = 'day';

    this.translateService.get(['Occupancy', 'Sold']).subscribe((translations) => {
      // translation loader is now ready
      this.data = this.buildOccupancyDataSummary(translations);
    });


  }

  buildOccupancyDataSummary(translations) {
    let occupancyData = [];
    const soldData = [];

    let occupancyKey = translations['Occupancy'];
    let soldKey = translations['Sold'];

    for (let i = 0; i < 31; i++) {
      let randomSold = Math.floor(Math.random() * (100));
      let occupancySold = Math.floor(Math.random() * (100));


      occupancyData.push({ x: i + 1, y: randomSold });
      soldData.push({ x: i + 1, y: occupancySold });
    }

    return [
      {
        key: occupancyKey,
        values: occupancyData,
        color: '#26c6da'
      }, {
        key: soldKey,
        values: soldData,
        color: '#ffa726'
      }
    ];

  }



}
