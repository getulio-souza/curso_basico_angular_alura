import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { RealTime } from '../../abstracts/realTime';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';

@Component({
  selector: 'engineering-thermostat-fan-chart',
  templateUrl: './thermostat-fan-chart.component.html',
  styleUrls: ['./thermostat-fan-chart.component.less']
})
export class ThermostatFanChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() temperatureUomIsFahrenheit;
  @Input() structure;
  @Input() dateToAcceptData;

  lastTraces;
  realTime;

  // chart configs
  options;
  data;

  highRooms;
  mediumRooms;
  lowRooms;
  offRooms;
  notAvailableDataRooms;

  constructor(private thermostatService: ThermostatService) { super() }

  ngOnChanges() {
    if (!this.structure) {
      return;
    }

    if (!this.realTime) {
      this.realTime = new RealTime();
      this.realTime.startGettingRealTimeData(() => {
        this.thermostatService.getLastTracesThermostatData(
          this.propertyId, this.propertyId, this.structure, this.dateToAcceptData, this.temperatureUomIsFahrenheit)
          .subscribe((lastThermostatTraces) => {
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
        callback: (chart) => {
          chart.pie.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        },
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,
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
    super.onChartClick(chartData.data, "Fan: " + chartData.key);
  }

  buildData() {

    this.highRooms = [];
    this.mediumRooms = [];
    this.lowRooms = [];
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
        if (lastTrace['fanspeed-state'] == 'high') {
          this.highRooms.push(lastTrace);
        } else if (lastTrace['fanspeed-state'] == 'medium') {
          this.mediumRooms.push(lastTrace);
        } else if (lastTrace['fanspeed-state'] == 'low') {
          this.lowRooms.push(lastTrace);
        } else if (lastTrace['fanspeed-state'] == 'off') {
          this.offRooms.push(lastTrace);
        } else {
          this.notAvailableDataRooms.push(lastTrace);
        }
      }

    });

    let res = [];
    res.push({ key: 'High', y: this.highRooms.length, data: this.highRooms, color: 'rgba(239, 83, 80, 1)' });
    res.push({ key: 'Medium', y: this.mediumRooms.length, data: this.mediumRooms, color: 'rgba(200, 200, 100,1)' });
    res.push({ key: 'Low', y: this.lowRooms.length, data: this.lowRooms, color: 'rgba(100, 83, 80,1)' });
    res.push({ key: 'Off', y: this.offRooms.length, data: this.offRooms, color: 'rgb(169, 169, 169)' });
    res.push({ key: 'N/A', y: this.notAvailableDataRooms.length, data: this.notAvailableDataRooms, color: '#333c49' });

    return res;

  }


}
