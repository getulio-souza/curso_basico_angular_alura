import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { FakeDataService } from '../../services/fake-data/fake-data.service';
import { DataService, TraceType } from '../../services/data/data.service';
import { DateService } from '../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { all } from 'q';
import { RoundValueInfo, NumericRoundService } from '../../services/numericRound/numeric-round.service';

@Component({
  selector: 'mult-chart-it',
  templateUrl: './mult-chart-it.component.html',
  styleUrls: ['./mult-chart-it.component.scss']
})
export class MultChartItComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  data;
  options;

  @Input() modelCards;
  @Input() propertyId;
  @Input() deviceTypes: Array<string>;



  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: " "
  };



  colorChartMap = {
    "Relay": "rgb(31, 119, 180)",
    "Level": "rgb(174, 199, 232)",
    "TV": "rgb(255, 127, 14)",
    "Mobiles": null,
    "Thermostat": "rgb(255, 187, 120)",
    "Curtain": "rgb(239, 111, 81)",
    "DoorSensor": 'rgba(213, 32, 32, 0.9)',
    "OccupancySensor": 'rgba(255, 255, 0, 0.613)',
    "Hygrometer": "rgb(152, 223, 138)",
    "PowerMeter": "rgb(148, 103, 189)",
    "WattMeter": "rgb(140, 86, 75)",
    "Chiller": "rgb(196, 156, 148)",
    "Thermometer": "rgb(227, 119, 194)",
    "ColdChamber": "rgb(127, 127, 127)",
    "AdvancedColdChamber": "rgb(232, 151, 0)",
    "DndMur": "rgb(44, 160, 44)"
  }


  constructor(
    private dataService: DataService,
    private roundService: NumericRoundService,
    dateService: DateService,
    private translateService: TranslateService) {
    super(dateService);
    this.updateChart();

    this.translateService.onLangChange.subscribe((event) => {
      this.reloadChartOptions();
    });

  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.deviceTypes != null) {
      this.getData();
    }
  }

  ngOnInit() {
  }

  buildBody() {

    let body = {};

    //building body using deviceTypes received
    this.deviceTypes.forEach(deviceType => {
      body['deviceTypeRuntime.' + deviceType] = 'SUM'
      body['offlineDeviceTypeRuntime.' + deviceType] = 'SUM'
      body['staleDeviceTypeRuntime.' + deviceType] = 'SUM'
      body['onlineDeviceTypeRuntime.' + deviceType] = 'SUM'
      body['deviceTypeTracesCount.' + deviceType] = 'SUM'
    });


    body['devicesCount'] = 'SUM';
    body['offlineDevicesCount'] = 'SUM';

    return body;

  }

  getData() {


    let body = this.buildBody();

    this.dataService.getReportByOwnerAndTag(
      this.propertyId,
      this.propertyId,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null, body, TraceType.PROPERTY_STATE_NORMALIZED).subscribe((response) => {

        this.data = new Array();

        this.buildTraceCountChart(response);
        this.buildOfflineChart(response);

      });
  }

  buildTraceCountChart(dataArray: Array<any>) {
    //preparing traceCounts

    const traceCountArray = [];

    let allData = [];

    dataArray.forEach((currentData) => {


      // this loop is used in case we have in the same card
      // more than one device type. In this case we want to
      // sum all trace counts for these device types.

      for (var property in currentData) {
        if (currentData.hasOwnProperty(property)) {
          if (property.includes("TracesCount.")) {
            // in case we are processing a deviceType Thermostat and Dnd
            // we expect something like:
            // "deviceTypeTracesCount.Thermostat": "21988"
            // "deviceTypeTracesCount.DndMur: 21576"
            let totalTraceCount = currentData['totalTraceCountAvailableDeviceTypes'];
            if (totalTraceCount == null) {
              //first
              totalTraceCount = 0;
            }

            // in this example lets sum Thermostat and Dnd
            totalTraceCount += currentData[property];
            currentData['totalTraceCountAvailableDeviceTypes'] = totalTraceCount;
          }
        }
      }


      // if we are looking for 'all' we should use tracesCount
      // that is already there. If we are using specifically deviceTypes
      // we should use 'totalTraceCountAvailableDeviceTypes'
      let traceCount;

      if (this.deviceTypes.includes("all")) {
        traceCount = currentData['tracesCount'];
      } else {
        traceCount = currentData['totalTraceCountAvailableDeviceTypes'];
      }

      allData.push(traceCount);

    });

    this.roundValueInfo = this.roundService.getRoundValueInfoByArray(allData, '');

    dataArray.forEach((currentData) => {
      let date = new Date(currentData.date);
      let xAxis = Number(this.getXAxis(date));

      let traceCount;

      if (this.deviceTypes.includes("all")) {
        traceCount = currentData['tracesCount'];
      } else {
        traceCount = currentData['totalTraceCountAvailableDeviceTypes'];
      }
      let roundResult = this.roundService.getRoundResult(this.roundValueInfo, traceCount);
      traceCountArray.push({ x: xAxis, y: roundResult.value, timestamp: currentData.date, data: currentData });

    });


    if (traceCountArray.length != 0) {
      let dataChart = {};
      dataChart['key'] = "Signal"
      dataChart['color'] = "rgba(255,255,255, .5)"
      dataChart['values'] = traceCountArray;
      dataChart['type'] = "line";
      dataChart['yAxis'] = 2;
      // this.data.push(dataChart);
    }
  }
  buildOfflineChart(dataArray: Array<any>) {
    let date: Date;

    let arraysOfflineDataMap = new Map();

    this.deviceTypes.forEach(deviceType => {

      let dataChart;
      const offlineArray = [];

      dataArray.forEach(currentData => {
        date = new Date(currentData.date);
        let xAxis = Number(this.getXAxis(date));

        //data ex: deviceTypeRuntime.Thermometer
        let totalSumRuntime = currentData['deviceTypeRuntime.' + deviceType];
        let sumOnline = currentData['onlineDeviceTypeRuntime.' + deviceType];
        let sumStale = currentData['staleDeviceTypeRuntime.' + deviceType];
        let sumOffline = currentData['offlineDeviceTypeRuntime.' + deviceType];

        //TODO - should not be using sum. Should receive totalSumRuntime from api
        totalSumRuntime = sumOnline + sumStale + sumOffline;

        if (totalSumRuntime != null) {
          let percentOffline = 100 * (sumOffline / totalSumRuntime);
          percentOffline = Math.round(percentOffline * 10) / 10;
          if(isNaN(percentOffline)){
            console.warn("Failed to get offline data for deviceType '" + deviceType + "' for this property. Please check 'it' configs.");
          } else {
            offlineArray.push({ x: xAxis, y: percentOffline, timestamp: currentData.date, data: currentData });
          }
        } else {
          console.warn("Could not get historical offline data for deviceType: '" + deviceType + "'");
        }

      });

      if (offlineArray.length != 0) {
        //if lenght is zero we do not have data
        //so, we should not add it to chart
        dataChart = {};
        dataChart['key'] = deviceType;
        dataChart['yAxis'] = 1;
        dataChart['type'] = 'bar';
        dataChart['values'] = offlineArray;
        dataChart = this.updateColorByDeviceType(dataChart, deviceType);
        arraysOfflineDataMap.set(deviceType, dataChart);
      }

    });


    this.reloadChartOptions();

    arraysOfflineDataMap.forEach((dataChart, deviceType, map) => {
      this.data.push(dataChart);
    });

  }


  updateColorByDeviceType(dataChart, deviceType) {
    let color = this.colorChartMap[deviceType];
    if (color != null) {
      dataChart['color'] = color;
    }
    return dataChart;
  }

  updateChart() {
    this.data = new Array();
    this.reloadChartOptions();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
        height: 350,
        stacked: false,
        legend: {
          align: false
        },
        margin: {
          top: 100,
          left: 70,
          right: 70,
          bottom: 100
        },
        interpolate: 'cardinal',
        useInteractiveGuideline: true,
        duration: 500,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) {
            return that.translateService.instant(that.getXAxisLabel(d));
          }
        },

        callback: chart => {
          chart.lines1.dispatch.on('elementClick', function (chartData) {
            //line is a litte bit different
            let data = chartData.series.values[chartData.pointIndex]
            that.onChartClick(data);
          });
          chart.bars1.dispatch.on('elementClick', function (chartData) {
            that.onChartClick(chartData.data);
          });
          chart.lines2.dispatch.on('elementClick', function (chartData) {
            //line is a litte bit different
            let data = chartData.series.values[chartData.pointIndex]
            that.onChartClick(data);
          });
          chart.bars2.dispatch.on('elementClick', function (chartData) {
            that.onChartClick(chartData.data);
          });
        },
        yAxis1: {
          tickPadding: 10,
          axisLabel: "offline",
          tickFormat: function (d) {
            return d + "%";
          }
        },
        yAxis2: {
          axisLabel: that.translateService.instant('Traffic volume'),
          tickFormat: function (d) {
            return d + that.roundValueInfo.uom;
          }
        }
      }
    };
  }


  onChartClick(info) {
    this.goDeeper(info);
  }

}
