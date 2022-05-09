import { Component, OnInit } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';

@Component({
  selector: 'it-connection-error-device-type',
  templateUrl: './connection-error-device-type.component.html',
  styleUrls: ['./connection-error-device-type.component.less']
})
export class ConnectionErrorDeviceTypeComponent extends AbstractChartActions implements OnInit {

  options;
  data;

  constructor() {
    super();
  }

  ngOnInit() {
    this.reloadChartOptions();
    this.data = this.getConnectionErrorByDevice();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 350,
        margin: {
          top: 0,
          right: 0
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: 'Rooms',
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'connection erros',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d * 100) / 100
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

  getConnectionErrorByDevice() {

    let lights = [];
    let tvs = [];
    let curtains = [];
    let hvacs = [];


    let roomIds = [
        201, 202, 203, 204, 205,
        301,302,303,304,305,306,
        401,402,403,404,405,406,
        501,502,503,504,505,506
      ];

    lights = this.buildDataRooms(roomIds);
    tvs = this.buildDataRooms(roomIds);
    curtains = this.buildDataRooms(roomIds);
    hvacs = this.buildDataRooms(roomIds);

    let ret = [
      {
        key: 'lights',
        values: lights,
        color: '#ef5350'
      },
      {
        key: 'tvs',
        values: tvs,
        color: '#66cbaa'
      }, {
        key: 'curtains',
        values: curtains,
        color: '#12aefe'
      }, {
        key: 'hvacs',
        values: hvacs,
        color: '#97aefe'
      }
    ];
    return ret;
  }

  buildDatabyRoom(room) {
    let totalDevices = Math.round(Math.random() * 10);

    let roomData = {
      x: room,
      y: totalDevices
    }

    return roomData;
  }

  buildDataRooms(rooms) {
    let totalDevices;
    let res = [];

    rooms.forEach(room => {

      totalDevices = Math.round(Math.random() * 10);

      let roomData = {
        x: room,
        y: totalDevices
      }

      res.push(roomData);
    });


    return res;
  }
}
