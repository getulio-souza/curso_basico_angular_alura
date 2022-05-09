import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'engineering-thermostat-state-chart',
  templateUrl: './thermostat-state-chart.component.html',
  styleUrls: ['./thermostat-state-chart.component.less']
})
export class ThermostatStateChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() structure;
  @Input() temperatureUomIsFahrenheit;
  @Input() dateToAcceptData;
  
  lastTraces;
  realTime: RealTime;

  soldRooms;
  unsoldRooms;
  notAvailableDataRooms;

  // chart configs
  options;
  data;


  constructor(private thermostatService: ThermostatService) {
    super();
  }

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
      })

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
    super.onChartClick(chartData.data, chartData.key);
  }

  buildData() {
    this.soldRooms = [];
    this.unsoldRooms = [];
    this.notAvailableDataRooms = [];


    this.lastTraces.forEach(lastTrace => {
      if (!lastTrace['timestamp']) {
        // offline / N/A
        this.notAvailableDataRooms.push(lastTrace);
      } else if (lastTrace['timestamp'] < this.dateToAcceptData) {
        // from now on, lets consider it as notAvailable
        this.notAvailableDataRooms.push(lastTrace);
      } else {
        if (lastTrace['active-profile-label'] == 'sold') {
          this.soldRooms.push(lastTrace);
        } else if (lastTrace['active-profile-label'] == 'unsold') {
          this.unsoldRooms.push(lastTrace);
        }
      }

    });

    let res = [];
    res.push({ key: 'Sold', y: this.soldRooms.length, data: this.soldRooms, color: '#ffa726' });
    res.push({ key: 'Unsold', y: this.unsoldRooms.length, data: this.unsoldRooms, color: 'rgba(130, 110, 60, 1)' });
    res.push({ key: 'N/A', y: this.notAvailableDataRooms.length, data: this.notAvailableDataRooms, color: '#333c49' });

    return res;
  }

}
