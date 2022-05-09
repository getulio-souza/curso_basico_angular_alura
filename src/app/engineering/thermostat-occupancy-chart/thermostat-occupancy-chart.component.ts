import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { RealTime } from '../../abstracts/realTime';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';

@Component({
  selector: 'engineering-thermostat-occupancy-chart',
  templateUrl: './thermostat-occupancy-chart.component.html',
  styleUrls: ['./thermostat-occupancy-chart.component.less']
})
export class ThermostatOccupancyChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() structure;
  @Input() temperatureUomIsFahrenheit;
  @Input() dateToAcceptData;

  lastTraces;
  realTime;


  occupiedRooms;
  unoccupiedRooms;
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
        this.thermostatService.getLastTracesThermostatData(
            this.propertyId, this.propertyId, this.structure, this.dateToAcceptData,this.temperatureUomIsFahrenheit).subscribe((lastThermostatTraces) => {
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
        pie: {
          startAngle: function (d) { return d.startAngle },
          endAngle: function (d) { return d.endAngle }
        },
        callback: (chart) => {
          chart.pie.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
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

    this.occupiedRooms = [];
    this.unoccupiedRooms = [];
    this.notAvailableDataRooms = [];

    this.lastTraces.forEach(lastTrace => {
      if (!lastTrace['timestamp']) {
        // offline / N/A
        this.notAvailableDataRooms.push(lastTrace);
      } else if (lastTrace['timestamp'] < this.dateToAcceptData) {
        // // from now on, lets consider it as notAvailable
        this.notAvailableDataRooms.push(lastTrace);
      } else {
        if (lastTrace['presence'] == 'true') {
          this.occupiedRooms.push(lastTrace);
        } else {
          this.unoccupiedRooms.push(lastTrace);
        }
      }
    });

    let res = [];
    res.push({ key: 'Occupied', y: this.occupiedRooms.length, data: this.occupiedRooms, color: '#26c6da' });
    res.push({ key: 'Unoccupied', y: this.unoccupiedRooms.length, data: this.unoccupiedRooms, color: 'rgba(100, 100, 130,1)' });
    res.push({ key: 'N/A', y: this.notAvailableDataRooms.length, data: this.notAvailableDataRooms, color: '#333c49' });

    return res;

  }

}
