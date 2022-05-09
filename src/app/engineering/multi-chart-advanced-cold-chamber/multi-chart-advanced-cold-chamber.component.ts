import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { DateService } from '../../services/date/date.service';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-multi-chart-advanced-cold-chamber',
  templateUrl: './multi-chart-advanced-cold-chamber.component.html',
  styleUrls: ['./multi-chart-advanced-cold-chamber.component.scss']
})
export class MultiChartAdvancedColdChamberComponent extends AbstractThirtyDays implements OnInit {

  data;
  options;
  @Input() properties;
  @Input() advancedColdChamberId;
  @Input() meterId;
  @Input() propertyId;


  negativeChamberDoorTemperature = {}
  sensorDoorTemperature = {};
  positiveChamberTemperature = {};
  negativeChamberRearTemperature = {};
  negativeChamberHumidity = {};
  activeEnergy = {};

  resolution = 'hour';


  chart;

  constructor(
    private dataService: DataService,
    private translateService: TranslateService,
    dateService: DateService) {
    super(dateService);

    this.startDate = this.dateService.getStartCurrentDay();
    this.endDate = this.dateService.getCurrentTime();

    this.translateService.onLangChange.subscribe((event) => {
      this.updateChart();
    });
  }


  ngOnInit() {
    this.updateChart();
  }


  updateChart() {
    this.data = new Array();
    this.reloadChartOptions();
    this.getData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
        callback: function (chart) {
          that.chart = chart;
          chart.lines1.dispatch.on('elementClick', function (chartData) {
            //line is a litte bit different
            let data = chartData.series.values[chartData.pointIndex]
            that.onChartClick(data);
          });
          chart.lines2.dispatch.on('elementClick', function (chartData) {
            //line is a litte bit different
            let data = chartData.series.values[chartData.pointIndex];
            that.onChartClick(data);;
          });
          chart.bars1.dispatch.on('elementClick', function (chartData) {
            that.onChartClick(chartData.data);
          });
          chart.bars2.dispatch.on('elementClick', function (chartData) {
            that.onChartClick(chartData.data);
          });
        },
        height: 300,
        interpolate: 'cardinal',
        stacked: true,
        legend: {
          align: false
        },
        margin: {
          right: 85,
          top: 80,
          bottom: 80
        },
        duration: 500,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) {
            return that.translateService.instant(that.getXAxisLabel(d));
          }
        },
        yAxis1: {
          axisLabel: 'Temperature',
          showMaxMin: false,
          tickFormat: function (d) {
            return d + 'ºC';
          }
        },
        yAxis2: {
          axisLabel: '% total',
          showMaxMin: false,
          tickFormat: function (d) {
            return d + '%';
          }
        }
      }
    };
  }

  onChartClick(info) {
    this.goDeeper(info);
  }


  buildColdChamberData(coldChamberArray: Array<any>) {

    let negativeChamberDoorTemperature;
    let sensorDoorTemperature;
    let positiveChamberTemperature;
    let negativeChamberRearTemperature;
    let negativeChamberHumidity;

    const negativeChamberDoorTemperatureValues = [];
    const sensorDoorTemperatureValues = [];
    const positiveChamberTemperatureValues = [];
    const negativeChamberRearTemperatureValues = [];
    const negativeChamberHumidityValues = [];


    coldChamberArray.forEach(coldChamberData => {
      let date = new Date(coldChamberData.date);

      negativeChamberDoorTemperature = Math.round(coldChamberData['negative-chamber-door-temperature']);
      let doorSensorPercent = 100 * coldChamberData['doorsensor'];
      sensorDoorTemperature = Math.round(doorSensorPercent * 100) / 100;
      positiveChamberTemperature = Math.round(coldChamberData['positive-chamber-temperature']);
      negativeChamberRearTemperature = Math.round(coldChamberData['negative-chamber-rear-temperature']);

      negativeChamberHumidity = 100 * Math.round(coldChamberData['negative-chamber-humidity'] * 100) / 100;

      const xAxis = Number(this.getXAxis(date));

      negativeChamberDoorTemperatureValues.push({ x: xAxis, y: negativeChamberDoorTemperature, label: xAxis, timestamp: coldChamberData.date });
      sensorDoorTemperatureValues.push({ x: xAxis, y: sensorDoorTemperature, timestamp: coldChamberData.date });
      positiveChamberTemperatureValues.push({ x: xAxis, y: positiveChamberTemperature, timestamp: coldChamberData.date });
      negativeChamberRearTemperatureValues.push({ x: xAxis, y: negativeChamberRearTemperature, timestamp: coldChamberData.date });
      negativeChamberHumidityValues.push({ x: xAxis, y: negativeChamberHumidity, timestamp: coldChamberData.date });

    });


    this.negativeChamberDoorTemperature = {};
    this.negativeChamberDoorTemperature['key'] = this.translateService.instant('Neg. Ch. Door Temp.');
    this.negativeChamberDoorTemperature['color'] = 'rgb(100, 176, 200)';
    this.negativeChamberDoorTemperature['values'] = negativeChamberDoorTemperatureValues;
    this.negativeChamberDoorTemperature['type'] = 'line';
    this.negativeChamberDoorTemperature['yAxis'] = 1;

    this.positiveChamberTemperature = {};
    this.positiveChamberTemperature['key'] = this.translateService.instant('Pos. Ch. Temp.');
    this.positiveChamberTemperature['color'] = 'rgb(112, 93, 160)';
    this.positiveChamberTemperature['values'] = positiveChamberTemperatureValues;
    this.positiveChamberTemperature['type'] = 'line';
    this.positiveChamberTemperature['yAxis'] = 1;

    this.negativeChamberRearTemperature = {};
    this.negativeChamberRearTemperature['key'] = this.translateService.instant('Neg. Ch. Rear Temp');
    this.negativeChamberRearTemperature['color'] = 'rgb(10, 67, 124)';
    this.negativeChamberRearTemperature['values'] = negativeChamberRearTemperatureValues;
    this.negativeChamberRearTemperature['type'] = 'line';
    this.negativeChamberRearTemperature['yAxis'] = 1;

    this.negativeChamberHumidity = {};
    this.negativeChamberHumidity['key'] = this.translateService.instant('Neg. Ch. Humidity');
    this.negativeChamberHumidity['color'] = 'rgb(224, 117, 45)';
    this.negativeChamberHumidity['values'] = negativeChamberHumidityValues;
    this.negativeChamberHumidity['type'] = 'line';
    this.negativeChamberHumidity['yAxis'] = 2;

    this.sensorDoorTemperature = {};
    this.sensorDoorTemperature['key'] = this.translateService.instant('Front Door');
    this.sensorDoorTemperature['color'] = 'rgb(87, 193, 123)';
    this.sensorDoorTemperature['values'] = sensorDoorTemperatureValues;
    this.sensorDoorTemperature['type'] = 'bar';
    this.sensorDoorTemperature['yAxis'] = 2;

  }


  buildActiveEnergyData(deviceDataArray: Array<any>) {
    const deviceDataValues = [];

    let max = 0;
    deviceDataArray.forEach(deviceData => {
      if (deviceData['activeEnergy'] > max) {
        max = deviceData['activeEnergy'];
      }
    });

    deviceDataArray.forEach(deviceData => {
      let date = new Date(deviceData.date);
      const xAxis = Number(this.getXAxis(date));
      let deviceDataValue = Math.round(deviceData['activeEnergy']);

      let percentValue = 100 * Math.round((deviceDataValue / max) * 100) / 100;
      deviceDataValues.push({ x: xAxis, y: percentValue, actveEnergyValue: deviceDataValue, timestamp: deviceData.date });
    });


    this.activeEnergy = {};
    this.activeEnergy['key'] = this.translateService.instant('Active Energy');
    this.activeEnergy['color'] = '#cc6666';
    this.activeEnergy['values'] = deviceDataValues;
    this.activeEnergy['type'] = 'area';
    this.activeEnergy['yAxis'] = 2;
  }

  getData() {
    const dataChart = [];

    this.getRequests().subscribe((res) => {

      //cold chamber
      const coldChamber = res[0];
      this.buildColdChamberData(coldChamber);
      dataChart.push(this.sensorDoorTemperature);
      dataChart.push(this.negativeChamberDoorTemperature);
      dataChart.push(this.positiveChamberTemperature);
      dataChart.push(this.negativeChamberRearTemperature);
      dataChart.push(this.negativeChamberHumidity);

      //active energy
      const activeEnergy = res[1];
      // this.buildActiveEnergyData(activeEnergy);
      // dataChart.push(this.activeEnergy);
      this.data = dataChart;

      this.reloadChartOptions();

    });
  }


  getRequests() {
    return forkJoin([this.getColdChamberRequest(), this.getActiveEnergyReport()]);
  }

  getColdChamberRequest() {
    const body = {};
    body['negative-chamber-door-temperature'] = 'AVG';
    body['doorsensor'] = 'AVG';
    body['positive-chamber-temperature'] = 'AVG';
    body['negative-chamber-rear-temperature'] = 'AVG';
    body['negative-chamber-humidity'] = 'AVG';

    return this.dataService.getReportByDeviceId(
      this.advancedColdChamberId,
      TraceType.ADVANCED_COLD_CHAMBER_NORM,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null,
      body,
      false);
  }


  getActiveEnergyReport() {

    const body = {};
    body['activeEnergy'] = 'SUM';


    return this.dataService.getReportByDeviceId(
      this.meterId,
      TraceType.POWERMETER_NORM,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null,
      body,
      false);




  }
}
