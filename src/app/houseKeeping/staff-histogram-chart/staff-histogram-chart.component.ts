import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'housekeeping-staff-histogram-chart',
  templateUrl: './staff-histogram-chart.component.html',
  styleUrls: ['./staff-histogram-chart.component.less']
})
export class StaffHistogramChartComponent extends AbstractChartActions implements OnChanges {

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
        height: 300,
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
          axisLabel: 'occurrences',
          tickFormat: (d) => {
            if (d == 1) {
              return "< 2"
            } else if (d == 2) {
              return "3-5"
            } else if (d == 3) {
              return "> 5"
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
    res.push({ x: 1, y: 25 })
    res.push({ x: 2, y: 3 })
    res.push({ x: 3, y: 5 })

    return [
      {
        key: 'Rooms',
        values: res,
        color: "rgba(82, 164, 0, 1)"
      }
    ];
  }

}
