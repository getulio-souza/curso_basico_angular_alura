import { Component, OnChanges, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { AbstractChartActions } from './../../abstracts/abstractChartActions';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'chart-pie-it',
  templateUrl: './chart-pie-it.component.html',
  styleUrls: ['./chart-pie-it.component.scss']
})
export class ChartPieItComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() selectedCard;
  @Input() propertyStatusData;

  totalDevices;
  totalOnlineDevices;
  totalStaleDevices;
  totalOfflineDevices;


  realTime: RealTime;

  percentOnline = 0;
  percentStale = 0;
  percentOffline = 100;

  // chart configs
  options;
  data;


  constructor() {
    super();
    this.data = new Array();
    this.data.push({ key: 'Offline', y: 1, data: null, color: '#333c49' });
    this.reloadChartOptions();
}

  ngOnChanges(changes: SimpleChanges) {
    if(this.selectedCard == null){
      return ;
    }
    this.data = this.buildData();
  }

  ngOnDestroy() {
    if (this.realTime) { this.realTime.clearInterval(); }
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        donut: true,
        height: 400,
        donutRatio: 0.7,
        showLegend: false,
        valueFormat: function (d) {
          return d3.format('.0f')(d);
        },
        pie: {
          startAngle: function (d) { return d.startAngle / 2 - Math.PI / 2; },
          endAngle: function (d) { return d.endAngle / 2 - Math.PI / 2; }
        },
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: false,
        duration: 500,
        labelType: 'percent',
        callback: (chart) => {
          d3.selectAll('.nv-pieLabels text').style('fill', 'white');
          chart.pie.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        }
      }
    }
  }

  onChartClick(chartData) {
    if (chartData.data) {
      super.onChartClick(chartData.data, chartData.key);
    }
  }

  buildData() {

    this.totalOnlineDevices = this.selectedCard.online;
    this.totalStaleDevices = this.selectedCard.stale;
    this.totalOfflineDevices = this.selectedCard.offline;
    this.totalDevices = this.selectedCard.total;

    if(this.totalOnlineDevices == null){
      this.totalOnlineDevices = 0;
    }

    this.percentOnline = Math.round(100 *  (this.totalOnlineDevices / this.totalDevices));
    this.percentStale = Math.round(100 *  (this.totalStaleDevices / this.totalDevices));
    this.percentOffline = 100 - this.percentOnline - this.percentStale;

    let res = [];
    res.push({ key: 'Online', y: this.totalOnlineDevices, color: '#66BB6A' });
    res.push({ key: 'Stale', y: this.totalStaleDevices, color: '#F5F901' });
    res.push({ key: 'Offline', y: this.totalOfflineDevices, color: '#EF5350' });

    return res;
  }

}
