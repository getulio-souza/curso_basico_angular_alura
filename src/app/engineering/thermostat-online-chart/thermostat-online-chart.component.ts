import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'engineering-thermostat-online-chart',
  templateUrl: './thermostat-online-chart.component.html',
  styleUrls: ['./thermostat-online-chart.component.less']
})
export class ThermostatOnlineChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() structure;
  @Input() temperatureUomIsFahrenheit;
  @Input() dateToAcceptData;

  lastTraces;
  realTime: RealTime;

  onlineThermostats = [];
  onlineThermostatsPerc = 0;
  notAvailableTHermostats = [];
  thermostatsTotal = 0;

  // chart configs
  options;
  data;


  constructor(private thermostatService: ThermostatService) {
    super();
    this.data = new Array();
    this.data.push({ key: 'Offline', y: 1, data: null, color: '#333c49' });
    this.reloadChartOptions();
}

  ngOnChanges() {

    if (!this.structure) {
      return;
    }

    if (!this.realTime) {
      this.realTime = new RealTime();
      this.realTime.startGettingRealTimeData(() => {
        this.thermostatService.getLastTracesThermostatData(this.propertyId, this.propertyId, this.structure, this.dateToAcceptData, this.temperatureUomIsFahrenheit).subscribe((lastThermostatTraces) => {
          this.lastTraces = lastThermostatTraces;
          this.data = new Array();
          this.reloadChartOptions();
          this.data = this.buildData();
        })
      })

    }

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

    this.onlineThermostats = [];
    this.notAvailableTHermostats = [];

    this.lastTraces.forEach(lastTrace => {
      if (!lastTrace['timestamp']) {
        // offline / N/A
        this.notAvailableTHermostats.push(lastTrace);
      } else if (lastTrace['timestamp'] < this.dateToAcceptData) {
        // from now on, lets consider it as notAvailable
        this.notAvailableTHermostats.push(lastTrace);
      } else {
        this.onlineThermostats.push(lastTrace);
      }

    });

    this.thermostatsTotal = this.onlineThermostats.length + this.notAvailableTHermostats.length;
    this.onlineThermostatsPerc = Math.floor(100 * this.onlineThermostats.length / this.thermostatsTotal);
    let color;

    if ( this.onlineThermostatsPerc < 35 ) {color = '#EF5350';}
    if ( this.onlineThermostatsPerc >= 35 &&  this.onlineThermostatsPerc <= 70 ) {color = '#FFA726';}
    if ( this.onlineThermostatsPerc > 70 &&  this.onlineThermostatsPerc < 95 ) {color = '#F5F901';}
    if ( this.onlineThermostatsPerc >= 95 ) {color = '#66BB6A';}

    let res = [];
    res.push({ key: 'Online', y: this.onlineThermostats.length, data: this.onlineThermostats, color: color });
    res.push({ key: 'Offline', y: this.notAvailableTHermostats.length, data: this.notAvailableTHermostats, color: '#333c49' });

    return res;
  }

}
