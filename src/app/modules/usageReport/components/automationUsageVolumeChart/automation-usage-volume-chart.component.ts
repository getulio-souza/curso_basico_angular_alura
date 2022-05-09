import { EVENT_TAG } from './../../../../services/event/event.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../../services/event/event.service';

@Component({
  selector: 'app-automation-usage-volume-chart',
  templateUrl: './automation-usage-volume-chart.component.html',
  styleUrls: ['./automation-usage-volume-chart.component.scss']
})
export class AutomationUsageVolumeChartComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() propertyId;
  @Input() tag;

  data = [];
  options;

  @Input() resolution;
  @Input() startDate;
  @Input() endDate;
  @Output() goDeeperEventEmitter = new EventEmitter<any>();

  systemDeviceTypes = new Set<string>();
  deviceTypesMap = new Map<any, any>();


  constructor(
    private translateService: TranslateService,
    private eventService: EventService,
    dateService: DateService) {

    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.propertyId != null) {
      this.reloadDataAndChart();
    }
  }


  reloadDataAndChart() {
    this.reloadChartOptions();
    this.getData();
  }


  getData() {
    const tag = this.tag != null ? this.tag : this.propertyId;
    this.eventService.getReportByTag(this.propertyId, tag, this.resolution.toUpperCase(), EVENT_TAG.ON_SET_EVENT, null, this.startDate, this.endDate,
      null, null, { 'location': 'ENUM', 'eventSubtype': 'ENUM' }, true).subscribe((res) => {
        this.data = [];
        this.reloadChartOptions();
        this.buildChartData(res);
      });

  }

  buildChartData(reports: Array<any>) {

    let deviceTypeData = [];
    reports = reports.reverse();
    let lastXAxisNumber = null;
    reports.forEach((report) => {
      let timestamp = new Date(report.date);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);


      if (lastXAxisNumber != null) {
        while (xAxisNumber - lastXAxisNumber > 1) {
          lastXAxisNumber++;
          deviceTypeData.push({ x: lastXAxisNumber, deviceTypes: {}, y: 0 });
        }
      }

      /** -------------------DEVICE TYPE DATA ------------------*/
      let deviceTypes: Object = report['eventSubtype'];
      // lets fill systemDeviceTypes set
      // with all received deviceTypes
      for (var deviceType in deviceTypes) {
        if (deviceTypes.hasOwnProperty(deviceType)) {
          this.systemDeviceTypes.add(deviceType);
        }
      }
      //and use aux array
      deviceTypeData.push({ x: xAxisNumber, deviceTypes, timestamp: timestamp });

      lastXAxisNumber = xAxisNumber;
    });



    /** -------------------DEVICE TYPE DATA ------------------*/
    // let ret = [];
    // then, for each deviceType in set
    // lets get data for each report received
    // naturally, in some cases it can be zero
    this.systemDeviceTypes.forEach(systemDeviceType => {
      let values = [];
      deviceTypeData.forEach(data => {
        let deviceTypeCount = data.deviceTypes[systemDeviceType];
        if (deviceTypeCount == null) { deviceTypeCount = 0; }
        values.push({ x: data.x, y: deviceTypeCount, info: { timestamp: data.timestamp, deviceType: systemDeviceType } });
      });

      let deviceTypesData = {};
      deviceTypesData['key'] = this.translateService.instant(systemDeviceType);;
      deviceTypesData['values'] = values;
      deviceTypesData['type'] = 'bar';
      deviceTypesData['yAxis'] = 1;
      this.data.push(deviceTypesData);

    });

  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 300,
        margin: {
          top: 50,
          right: 20,
          bottom: 60,
          left: 45
        },
        clipEdge: true,
        duration: 500,
        tooltips: true,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        yAxis: {
          axisLabel: 'Total',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d;
          }
        },
        tooltip: {
          contentGenerator: function (e) {
            var series = e.series[0];
            if (series.value === null) return;

            let eventsLabel = that.translateService.instant("events");
            let toolTip = `
            <table>
            <thead>
                <tr>
                    <td colspan="3"><strong class="x-value">` + e.value + `</strong></td>
                </tr>
            </thead>
                <tbody>
                    <tr>
                        <td class="legend-color-guide">
                            <div style="background-color:` + series.color + `"></div>
                        </td>
                        <td class="key">` + series.key + `</td>
                        <td class="value">` + series.value + " " + eventsLabel + `</td>
                    </tr>
                </tbody>
            </table>
            `;

            return toolTip;
          }
        },
        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.info);
          })
        }
      }
    }
  }

  onChartClick(info) {
    this.goDeeperEventEmitter.emit(info);
  }

}