import { Component, Input, OnInit } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { DateService } from '../../services/date/date.service';
import { forkJoin } from 'rxjs';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'engineering-cooling-demand-chart',
  templateUrl: './cooling-demand-chart.component.html',
  styleUrls: ['./cooling-demand-chart.component.less']
})
export class CoolingDemandChartComponent extends AbstractThirtyDays implements OnInit {

  @Input() propertyId;
  @Input() chillerId;
  @Input() thermometerId;
  data;
  options;


  resolution = 'hour';

  coolingDemand = {};
  chillerEnteringCool = {};
  chillerEnteringCondesing = {};
  chillerLeavingCool = {};
  chillerLeavingCondensing = {};
  externalTemperature = {};
  occupancy = {};


  constructor(
    private dataService: DataService,
    private translateService: TranslateService,
    dateService: DateService) {
    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.updateChart();
    });
    
  }

  ngOnInit() {
    this.startDate = this.dateService.getStartCurrentDay();
    this.endDate = this.dateService.getCurrentTime();
    this.updateChart();
  }


  updateChart() {
    this.data = new Array();
    this.getData();
    this.reloadChartOptions();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
        callback: function (chart) {
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
        height: 400,
        interpolate: 'cardinal',
        margin: {
          left: 100,
          right: 50,
          top: 120
        },
        useInteractiveGuideline: false,
        legend: {
          margin: {
            right: 30,
            left: 30
          },
          align: false
        },
        duration: 500,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        yAxis1: {
          axisLabel: 'Cooling Demand / Occupancy',
          showMaxMin: false,
          tickFormat: function (d) {
            return d + '%';
          }
        },
        yDomain2: [-5, 40],
        yAxis2: {
          axisLabel: 'Temperature',
          showMaxMin: false,
          tickFormat: function (d) {
            return d + 'ºC';
          }
        }
      }
    };
  }


  onChartClick(info) {
    this.goDeeper(info);
  }

  buildChillerData(chillerDataArray: Array<any>) {
    let date: Date;

    const chillerEnteringCondensingWaterValue = [];
    const chillerEnteringCoolWaterValues = [];
    const chillerLeavingCondensingWaterValues = [];
    const chillerLeavingCoolWaterValues = [];

    chillerDataArray.forEach(chillerData => {
      date = new Date(chillerData.date);
      const enteringCondesingWaterValue = Math.round(chillerData['entering-condensing-water-temperature']);
      const enteringCoolWaterValue = Math.round(chillerData['entering-cool-water-temperature']);
      const leavingCondensingWaterValue = Math.round(chillerData['leaving-condensing-water-temperature']);
      const leavingCoolWaterValue = Math.round(chillerData['leaving-cool-water-temperature']);

      let xAxis = Number(this.getXAxis(date));

      chillerEnteringCondensingWaterValue.push({ x: xAxis, y: enteringCondesingWaterValue, timestamp: chillerData.date });
      chillerEnteringCoolWaterValues.push({ x: xAxis, y: enteringCoolWaterValue, timestamp: chillerData.date });
      chillerLeavingCondensingWaterValues.push({ x: xAxis, y: leavingCondensingWaterValue, timestamp: chillerData.date });
      chillerLeavingCoolWaterValues.push({ x: xAxis, y: leavingCoolWaterValue, timestamp: chillerData.date });
    });


    this.chillerEnteringCondesing = {};
    this.chillerEnteringCondesing['key'] = this.translateService.instant('Chiller Entering Condens.');
    this.chillerEnteringCondesing['values'] = chillerEnteringCondensingWaterValue;
    this.chillerEnteringCondesing['color'] = 'rgb(150, 115, 2)';
    this.chillerEnteringCondesing['type'] = 'line';
    this.chillerEnteringCondesing['yAxis'] = 2;

    this.chillerEnteringCool = {};
    this.chillerEnteringCool['key'] = this.translateService.instant('Chiller Entering Cool');
    this.chillerEnteringCool['values'] = chillerEnteringCoolWaterValues;
    this.chillerEnteringCool['color'] = 'rgb(137, 15, 2)';
    this.chillerEnteringCool['type'] = 'line';
    this.chillerEnteringCool['yAxis'] = 2;

    this.chillerLeavingCondensing = {};
    this.chillerLeavingCondensing['key'] = this.translateService.instant('Chiller Leaving Condens.');
    this.chillerLeavingCondensing['values'] = chillerLeavingCondensingWaterValues;
    this.chillerLeavingCondensing['color'] = 'rgb(229, 172, 14)';
    this.chillerLeavingCondensing['type'] = 'line';
    this.chillerLeavingCondensing['yAxis'] = 2;

    this.chillerLeavingCool = {};
    this.chillerLeavingCool['key'] = this.translateService.instant('Chiller Leaving Cool');
    this.chillerLeavingCool['values'] = chillerLeavingCoolWaterValues;
    this.chillerLeavingCool['color'] = 'rgb(10, 67, 124)';
    this.chillerLeavingCool['type'] = 'line';
    this.chillerLeavingCool['yAxis'] = 2;
  }

  buildOccupancy(presenceAndRunTimeArray: Array<any>) {
    let presence;
    let coolingDemand;
    let date: Date;

    const occupancyValues = [];
    const coolingDemandValues = [];
    presenceAndRunTimeArray.forEach(data => {
      date = new Date(data.key);
      presence = Math.round(100 * (data.presenceTime / data.elapsedTime));
      coolingDemand = Math.round(100 * (data.runtime / data.elapsedTime));
      const xAxis = Number(this.getXAxis(date));
      occupancyValues.push({ x: xAxis, y: presence, timestamp: data.key });
      coolingDemandValues.push({ x: xAxis, y: coolingDemand, timestamp: data.key });
    });

    this.occupancy = {};
    this.occupancy['key'] = this.translateService.instant('Occupancy');
    this.occupancy['values'] = occupancyValues;
    this.occupancy['color'] = 'rgb(204, 163, 0)';
    this.occupancy['type'] = 'area';
    this.occupancy['yAxis'] = 1;

    this.coolingDemand = {};
    this.coolingDemand['key'] = this.translateService.instant('Cooling Demand');
    this.coolingDemand['values'] = coolingDemandValues;
    this.coolingDemand['color'] = 'rgb(68, 126, 188)';
    this.coolingDemand['type'] = 'bar';
    this.coolingDemand['yAxis'] = 1;


  }

  buildThermometerData(thermometerDataArray: Array<any>) {
    let temperature;
    let date: Date;

    const externalTemperatureValues = [];
    thermometerDataArray.forEach(thermometerData => {
      date = new Date(thermometerData.date);
      temperature = Math.round(thermometerData['temperature']);
      let xAxis = Number(this.getXAxis(date));
      externalTemperatureValues.push({ x: xAxis, y: temperature, thermometerInfo: thermometerData, timestamp: thermometerData.date });
    });

    this.externalTemperature = {};
    this.externalTemperature['key'] = this.translateService.instant('External Temp.');
    this.externalTemperature['values'] = externalTemperatureValues;
    this.externalTemperature['color'] = 'rgb(150, 45, 130)';
    this.externalTemperature['type'] = 'line';
    this.externalTemperature['yAxis'] = 2;

  }

  getData() {
    const dataChart = [];

    this.getRequests().subscribe((res) => {
      const presenceAndRunTime = res[0];
      const chillerData = res[1];
      const thermometerData = res[2];

      this.buildThermometerData(thermometerData);
      this.buildChillerData(chillerData);
      this.buildOccupancy(presenceAndRunTime);

      this.trimData(this.externalTemperature, this.occupancy);
      this.trimData(this.chillerEnteringCool, this.occupancy);
      this.trimData(this.chillerLeavingCool, this.occupancy);

      this.padData(this.externalTemperature, this.occupancy);
      this.padData(this.chillerEnteringCool, this.occupancy);
      this.padData(this.chillerLeavingCool, this.occupancy);


      dataChart.push(this.externalTemperature);
      dataChart.push(this.chillerEnteringCool);
      dataChart.push(this.chillerLeavingCool);
      dataChart.push(this.occupancy);
      dataChart.push(this.coolingDemand);

      this.data = dataChart;
      this.reloadChartOptions();
    });
  }

  trimData(data, referenceData) {
    if (!data || !referenceData) {
      return;
    }

    let dataValues = data['values'];
    let referenceDataValues = referenceData['values'];
    if (!dataValues || !referenceDataValues) {
      return;
    }

    for (let i = referenceDataValues.length; i < dataValues.length; i++) {
      dataValues.pop();
    }
  }

  padData(data, referenceData) {
    if (!data || !referenceData) {
      return;
    }
    let dataValues = data['values'];
    let referenceDataValues = referenceData['values'];
    if (!dataValues || !referenceDataValues) {
      return;
    }

    for (let i = dataValues.length; i < referenceDataValues.length; i++) {
      dataValues.push({
        x: referenceData[i].x,
        y: 0
      });
    }
  }



  getRequests() {
    const presenceAndRuntime = this.dataService.getOccupancyAndConsumptionList(this.propertyId, this.propertyId, this.resolution, this.startDate, this.endDate, null, null);
    const chillerBody = {
      'leaving-cool-water-temperature': 'AVG',
      'entering-cool-water-temperature': 'AVG',
      'entering-condensing-water-temperature': 'AVG',
      'leaving-condensing-water-temperature': 'AVG'
    };
    const chillerData = this.dataService.getReportByDeviceId(this.chillerId, TraceType.CHILLER_NORM, this.resolution, this.startDate, this.endDate, null, null, chillerBody, false);
    const thermometerBody = {
      'temperature': 'AVG'
    };
    const thermometerData = this.dataService.getReportByDeviceId(this.thermometerId, TraceType.THERMOMETER_NORM, this.resolution, this.startDate, this.endDate, null, null, thermometerBody, false);
    return forkJoin([presenceAndRuntime, chillerData, thermometerData]);
  }
}
