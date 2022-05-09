import { AbstractChartActions } from './../../abstracts/abstractChartActions';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'housekeeping-makeuproom-delta-time-chart',
  templateUrl: './makeuproom-delta-time-chart.component.html',
  styleUrls: ['./makeuproom-delta-time-chart.component.less']
})
export class MakeuproomDeltaTimeChartComponent extends AbstractChartActions implements OnChanges {

  @Input() lastTraces;
  @Input() dateToAcceptData;

  data;
  options;

  constructor() { super() }

  ngOnChanges() {
    this.data = new Array();
    this.reloadChartOptions();
    this.data = this.buildData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 350,
        margin: {
          top: 0,
          right: 0
        },
        showMaxMin: true,
        clipEdge: true,
        duration: 500,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: 'minutes',
          tickFormat: (d) => {
            if (d == 1) {
              return "< 10"
            } else if (d == 2) {
              return "10-20"
            } else if (d == 3) {
              return "> 20"
            }
            return d;
          }
        },
        yAxis: {
          axisLabel: 'Rooms',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d);
          }
        },
        callback: (chart) => {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        },
      }
    };
  }



  onChartClick(chartData) {
    console.log(chartData);
    // super.onChartClick(chartData.data, null);
  }

  buildData() {
    let res = [];
    res.push({ x: 1, y: 40 })
    res.push({ x: 2, y: 90 })
    res.push({ x: 3, y: 50 })

    return [
      {
        key: 'Rooms',
        values: res,
        color: "rgba(239, 83, 80, 1)"
      }
    ];
  }
}

