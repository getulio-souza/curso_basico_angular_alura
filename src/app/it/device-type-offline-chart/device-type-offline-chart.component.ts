import { AbstractChartActions } from './../../abstracts/abstractChartActions';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'it-device-type-offline-chart',
  templateUrl: './device-type-offline-chart.component.html',
  styleUrls: ['./device-type-offline-chart.component.less']
})
export class DeviceTypeOfflineChartComponent extends AbstractChartActions implements OnChanges {

  @Input() allDevices;

  data;
  options;

  providerDeviceTypeMap = {};

  constructor() {
    super();
  }

  ngOnChanges() {
    this.reloadChartOptions();
    this.data = this.getChartData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 350,
        margin: {
          top: 0,
          right: 0,
          left: 150
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false,
        xAxis: {
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'total devices offline',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d
          }
        },
        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        }
      }
    };
  }

  onChartClick(event) {
    super.onChartClick(event.devices, null);
  }

  getChartData() {
    let res = [];

    this.allDevices.forEach(device => {
      let provider = device['deviceId'].split('.')[0]
      let deviceType = device['deviceType'];
      let key = provider + " " + deviceType;

      let random = Math.random();

      //TODO - real check if its down
      if (random > 0.7) {
        //is down
        if (this.providerDeviceTypeMap[key] == null) {
          //first combination of provider + deviceType
          this.providerDeviceTypeMap[key] = {};
          this.providerDeviceTypeMap[key]['total'] = 0;
          this.providerDeviceTypeMap[key]['devices'] = [];
        }
        this.providerDeviceTypeMap[key]['total']++;
        this.providerDeviceTypeMap[key]['devices'].push(device);
      }

    });
    Object.keys(this.providerDeviceTypeMap).forEach((key, index) => {
      // key: the name of the object key
      // index: the ordinal position of the key within the object 
      res.push({ 
                x: key,
                y: this.providerDeviceTypeMap[key]['total'],
                devices: this.providerDeviceTypeMap[key]['devices']
              })
    });


    return [
      {
        key: 'Devices offline',
        values: res,
        color: '#ef5350'
      }
    ];


  }


}
