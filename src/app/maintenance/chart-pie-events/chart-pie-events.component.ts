import {AbstractChartActions} from './../../abstracts/abstractChartActions';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chart-pizza-events',
  templateUrl: './chart-pie-events.component.html',
  styleUrls: ['./chart-pie-events.component.scss']
})
export class ChartPieEventsComponent extends AbstractChartActions implements OnChanges, OnInit {

  options;
  data;

  @Input() chartNumber;
  @Input() chartStatus;
  @Input() chartAverage;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = this.buildData();
  }

  updateChart() {
    this.data = new Array();
    this.reloadChartOptions();
    this.data = this.buildData();
  }
  ngOnInit() {
    this.updateChart();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        height: 200,
        duration: 500,
        legendPosition: 'right',
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 30,
            left: 0
          }
        },
        valueFormat: function (d) {
          return d3.format('.0f')(d);
        },
        donut: false,
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.y;
        },
        showLabels: true,
        pie: {
          startAngle: function (d) {
            return d.startAngle;
          },
          endAngle: function (d) {
            return d.endAngle;
          }
        }
      }
    };
  }

  buildData() {
    const res = [];
    switch (this.chartNumber) {
      case 2:
        res.push({key: 'Cleaning', y: 35, data: null, color: '#b9d01a'});
        res.push({key: 'Technical issues', y: 25, data: null, color: '#96a92c'});
        res.push({key: 'Room service', y: 10, data: null, color: '#7e8e39'});
        res.push({key: 'Pool services', y: 10, data: null, color: '#5b674b'});
        res.push({key: 'Others', y: 20, data: null, color: '#333C49'});
        break;
      case 3:
        res.push({key: 'Cleaning', y: 35, data: null, color: '#E84D4D'});
        res.push({key: 'Technical issues', y: 8, data: null, color: '#91474D'});
        res.push({key: 'Room service', y: 8, data: null, color: '#61444D'});
        res.push({key: 'Pool services', y: 8, data: null, color: '#47424E'});
        res.push({key: 'Others', y: 45, data: null, color: '#333C49'});
        break;
      case 4:
        res.push({key: 'Cleaning', y: 20, data: null, color: '#00DCA9'});
        res.push({key: 'Technical issues', y: 23, data: null, color: '#1C8F7B'});
        res.push({key: 'Room service', y: 23, data: null, color: '#2B6563'});
        res.push({key: 'Pool services', y: 23, data: null, color: '#344E55'});
        res.push({key: 'Others', y: 14, data: null, color: '#333C49'});
        break;
      default:
        res.push({key: 'Cleaning', y: 20, data: null, color: '#26c6da'});
        res.push({key: 'Technical issues', y: 20, data: null, color: '#2fa2b3'});
        res.push({key: 'Room service', y: 20, data: null, color: '#348999'});
        res.push({key: 'Pool services', y: 20, data: null, color: '#3e6572'});
        res.push({key: 'Others', y: 20, data: null, color: '#333C49'});
    }
    return res;
  }
}
