import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'engineering-thermostat-mode-chart',
  templateUrl: './thermostat-mode-chart.component.html',
  styleUrls: ['./thermostat-mode-chart.component.less']
})
export class ThermostatModeChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() structure;
  @Input() temperatureUomIsFahrenheit;
  @Input() dateToAcceptData;

  lastTraces;
  realTime;

  heatRooms;
  coolRooms;
  autoRooms
  offRooms;
  notAvailableDataRooms;

  // chart configs
  options;
  data;


  constructor(private thermostatService: ThermostatService) { super(); }

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
      });
    }

  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        valueFormat: function (d) {
          return d3.format('.0f')(d);
        },
        donut: true,
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,
        callback: (chart) => {
          chart.pie.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        },
        pie: {
          startAngle: function (d) { return d.startAngle },
          endAngle: function (d) { return d.endAngle }
        },
        duration: 500,
        legendPosition: 'bottom',
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 30,
            left: 0
          }
        }
      }
    };
  }

  onChartClick(chartData) {
    super.onChartClick(chartData.data, "Mode: " + chartData.key);
  }
  buildData() {

    this.heatRooms = [];
    this.coolRooms = [];
    this.autoRooms = [];
    this.offRooms = [];
    this.notAvailableDataRooms = [];

    this.lastTraces.forEach(lastTrace => {
      if (!lastTrace['timestamp']) {
        // offline / N/A
        this.notAvailableDataRooms.push(lastTrace);
      } else if (lastTrace['timestamp'] < this.dateToAcceptData) {
        // // from now on, lets consider it as notAvailable
        this.notAvailableDataRooms.push(lastTrace);
      } else {
        if (lastTrace['mode'] == 'heat') {
          this.heatRooms.push(lastTrace);
        } else if (lastTrace['mode'] == 'cool') {
          this.coolRooms.push(lastTrace);
        } else if (lastTrace['mode'] == 'off') {
          this.offRooms.push(lastTrace);
        } else if (lastTrace['mode'] == 'auto') {
          this.autoRooms.push(lastTrace);
        } else {
          this.notAvailableDataRooms.push(lastTrace);
        }
      }

    });

    let res = [];

    res.push({ key: 'Heat', y: this.heatRooms.length, data: this.heatRooms, color: 'rgba(239, 83, 80,1)' });
    res.push({ key: 'Cool', y: this.coolRooms.length, data: this.coolRooms, color: '#26c6da' });
    res.push({ key: 'Auto', y: this.autoRooms.length, data: this.autoRooms, color: '#66bb6a' });
    res.push({ key: 'Off', y: this.offRooms.length, data: this.offRooms, color: 'rgb(169, 169, 169)' });
    res.push({ key: 'N/A', y: this.notAvailableDataRooms.length, data: this.notAvailableDataRooms, color: '#333c49' });

    return res;


  }




}
