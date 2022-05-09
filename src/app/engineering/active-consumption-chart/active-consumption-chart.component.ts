import { Component, OnInit, Input } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { DateService } from '../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { RoundValueInfo, NumericRoundService } from '../../services/numericRound/numeric-round.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'engineering-active-consumption-chart',
  templateUrl: './active-consumption-chart.component.html',
  styleUrls: ['./active-consumption-chart.component.less']
})
export class ActiveConsumptionChartComponent extends AbstractThirtyDays implements OnInit {

  @Input() propertyId;

  //device meters
  @Input() activeConsumptionConfig;

  resolution;

  roundValueInfo: RoundValueInfo = {
    divideBy: 1,
    uom: "Wh"
  };

  constructor(dateService: DateService,
    private numericRoundService: NumericRoundService,
    private dataService: DataService,
    private translateService: TranslateService) {

    super(dateService);
    this.translateService.onLangChange.subscribe((event) => {
      this.reloadChartOptions();
    });
  }

  ngOnInit() {
    this.reloadDataAndChart();
  }

  reloadDataAndChart() {
    this.data = [];
    this.getData();

  }
  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 390,
        margin: {
          top: 50,
          right: 50,
          left: 120
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false,
        showLegend: true,
        tooltip: {
          contentGenerator: function (e) {
            var series = e.series[0];
            if (series.value === null) return;

            let meterName = "";
            if (e.data.device != null) {
              if (e.data.device.label != null) {
                meterName = " (" + e.data.device.label + ") ";
              }
            }

            var header =
              "<thead>" +
              "<tr>" +
              "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
              "<td class='key'><strong>" + meterName + that.translateService.instant(that.getXAxisLabel(e.value)); + "</strong></td>" +
                "</tr>" +
                "</thead>";

            var rows =
              "<tr>" +
              "<td class='x-value'>" + e.data.consumptionInfo.label + "</td>" +
              "</tr>";

            return "<table>" +
              header +
              "<tbody>" +
              rows +
              "</tbody>" +
              "</table>";
          }
        },
        yAxis: {

          axisLabel: that.roundValueInfo.uom,
          showMaxMin: true,
          axisLabelDistance: 0,
          tickFormat: function (value) {
            return value;
          }
        },
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },

        callback: chart => {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.consumptionInfo);
          });
        }
      }
    };
  }

  onChartClick(info) {
    this.goDeeper(info);
  }


  getData() {

    let requests = [];
    if (this.activeConsumptionConfig == null || this.activeConsumptionConfig.length == 0) {
      //no config
      requests.push(this.getDataFromTag(this.propertyId));
    } else {
      //there is a config
      this.activeConsumptionConfig.forEach(config => {
        if (config.deviceId != null) {
          requests.push(this.getDataFromDevice(config.deviceId))
        } else {
          //lets use tag
          requests.push(this.getDataFromTag(config.tag));
        }
      });
    }

    forkJoin(requests).subscribe((res: Array<Array<any>>) => {
      this.data = this.buildChartData(res);
    });

  }

  getDataFromTag(tag) {
    return this.dataService.getActiveConsumptionReport(
      this.propertyId,
      tag,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null);
  }

  getDataFromDevice(deviceId) {
    const body = {};
    body['activeEnergy'] = 'SUM';
    body['reactiveEnergy'] = 'SUM';
    body['reactiveEnergyType'] = 'ENUM';
    body['period'] = 'ENUM';
    return this.dataService.getReportByDeviceId(deviceId, TraceType.POWERMETER_NORM, this.resolution, this.startDate, this.endDate, null, null, body, false);


  }


  buildChartData(activeEnergiesArrays: Array<Array<any>>) {

    let ret = [];
    let colors = [
      "#4f8c3c",
      "#7cc361"
    ]

    // just preparing array
    let data = [];

    activeEnergiesArrays.forEach(activeEnergiesArray => {
      activeEnergiesArray.forEach(activeEnergy => {
        data.push(activeEnergy['activeEnergy']);
      });
    });

    this.roundValueInfo = this.numericRoundService.getRoundValueInfoByArray(data, "Wh");

    this.reloadChartOptions();


    for (let i = 0; i < activeEnergiesArrays.length; i++) {
      let activeConsumptionList = this.buildActiveConsumptionList(activeEnergiesArrays[i], i);
      let key = this.activeConsumptionConfig[i].label;

      ret.push({
        key: key,
        values: activeConsumptionList,
        color: colors[i % 2]
      })
    }

    return ret;
  }


  buildActiveConsumptionList(activeEnergies: Array<any>, responseIndex) {
    const activeConsumptionList = [];
    let result: {};
    let activeEnergy;
    let date: Date;

    for (let i = 0; i < activeEnergies.length; i++) {
      result = activeEnergies[i];

      if (result['key'] != null) {
        //report by tag we receive as key
        result['timestamp'] = result['key'];
      } else {
        //report by id we receive as date
        result['timestamp'] = result['date'];
      }

      date = new Date(result['timestamp']);
      activeEnergy = result['activeEnergy'];

      let roundResult = this.numericRoundService.getRoundResult(this.roundValueInfo, activeEnergy);

      activeEnergy = roundResult.value;
      result['label'] = roundResult.label;

      let xAxis = this.getXAxis(date);

      let device = null;
      if (this.activeConsumptionConfig != null && this.activeConsumptionConfig.length != 0) {
        device = this.activeConsumptionConfig[responseIndex]
      }
      activeConsumptionList.push({ key: xAxis, x: xAxis, y: activeEnergy, consumptionInfo: result, device: device });

    }

    return activeConsumptionList;
  }

}
