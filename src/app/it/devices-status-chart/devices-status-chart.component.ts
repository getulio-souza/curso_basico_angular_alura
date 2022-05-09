import { AbstractChartActions } from './../../abstracts/abstractChartActions';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'it-devices-status-chart',
  templateUrl: './devices-status-chart.component.html',
  styleUrls: ['./devices-status-chart.component.less']
})
export class DevicesStatusChartComponent extends AbstractChartActions implements OnChanges {

  @Input() allDevices;

  options;
  data;

  onlineDevices = [];
  offlineDevices = [];

  constructor() {
    super();
  }

  ngOnChanges() {
    this.reloadChartOptions();
    this.data = this.getDevicesStatusData(this.allDevices);
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        valueFormat: function(d){
          return d3.format('.0f')(d);
        },
        height: 350,
        donut: false,
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
        duration: 1000,
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    };
  }

  onChartClick(event) {
    super.onChartClick(event.devices, null);
  }

  getDevicesStatusData(devices) {

    let res = [];
    this.onlineDevices = [];
    this.offlineDevices = [];

    let random;
    devices.forEach(device => {

      random =  Math.random();
      //TODO - is fake -> 
      //get online attribute from device
      if (random > 0.3) {
        device['online'] = true;
        this.onlineDevices.push(device);
      } else {
        device['online'] = false;
        this.offlineDevices.push(device);
      }
    });

    res.push({ key: 'Online', y: this.onlineDevices.length, devices: this.onlineDevices, color: 'rgba(0, 83, 80, 1)' });
    res.push({ key: 'Offline', y: this.offlineDevices.length, devices: this.offlineDevices, color: 'rgba(239, 83, 80, 1)' });

    return res;
  }
}
