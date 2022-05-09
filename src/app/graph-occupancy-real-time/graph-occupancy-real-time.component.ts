import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-graph-occupancy-real-time',
  templateUrl: './graph-occupancy-real-time.component.html',
  styleUrls: ['./graph-occupancy-real-time.component.css']
})
export class GraphOccupancyRealTimeComponent implements OnInit, OnChanges {

  @Input() energyGroupId;

  // chart configs
  options;
  data;

  occupancyKey;
  soldKey;
  
  constructor(private translateService: TranslateService) {

    this.translateService.onLangChange.subscribe( (event) => {
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
        type: 'discreteBarChart',
        height: 250,
        margin: {
          top: 0,
          right: 0
        },
        x: function (d) { return d.label; },
        y: function (d) { return d.value; },
        showValues: true,
        valueFormat: function (d) {
          return d3.format(',.0f')(d);
        },
        duration: 500,
        xAxis: {
          showMaxMin: true
        },
        yAxis: {
          axisLabel: '%',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d);
          }
        }
      }
    };
  }


  getData() {
    this.data = new Array();
    this.reloadChartOptions();

    // TODO - use service.. then
    this.translateService.get(['Occupancy', 'Sold']).subscribe( (translations) => {
      // translation loader is now ready
      this.occupancyKey = translations['Occupancy'];
      this.soldKey = translations['Sold'];
      const results = new Array();
      this.data = this.buildData(results);
    });
  }

  buildData(results) {

    const ocupped = Math.random() * 70;
    let on = ocupped - Math.random() * 20;
    if (on < 0) {
      on = - on;
    }

    return [
      {
        key: 'Cumulative Return',
        values: [
          {
            'label': this.occupancyKey,
            'value': on,
            'color': '#26c6da'
          },
          {
            'label': this.soldKey,
            'value': ocupped,
            'color': '#ffa726'
          }
        ]
      }
    ];
  }


}
