import { DateService } from './../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';

@Component({
  selector: 'it-offline-devices-by-day',
  templateUrl: './offline-devices-by-day.component.html',
  styleUrls: ['./offline-devices-by-day.component.less']
})
export class OfflineDevicesByDayComponent extends AbstractChartActions implements OnInit {
  options;
  data;

  constructor(private dateService: DateService) {
    super();
   }

  ngOnInit() {
    this.reloadChartOptions();
    this.data = this.getConnectionErrorByDay();
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
          axisLabel: 'day',
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'devices offline',
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


  getConnectionErrorByDay() {

    let lights = [];
    let tvs = [];
    let curtains = [];
    let hvacs = [];


    let first = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(0)));
    let second = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(1)));
    let third = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(2)));
    let fourth = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(3)));
    let fifth = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(4)));
    let sixth = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(5)));
    let seventh = Number(this.dateService.getDay(this.dateService.getXDaysBeforeFromNow(6)));


    let days = [seventh, sixth, fifth, fourth, third, second, first];

    lights = this.buildData(days);
    tvs = this.buildData(days);
    curtains = this.buildData(days);
    hvacs = this.buildData(days);


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

  buildData(days) {
    let totalDevices;
    let res = [];

    days.forEach(day => {

      totalDevices = Math.round(Math.random() * 10);

      let dayData = {
        x: day,
        y: totalDevices
      }

      res.push(dayData);
    });


    return res;
  }



}
