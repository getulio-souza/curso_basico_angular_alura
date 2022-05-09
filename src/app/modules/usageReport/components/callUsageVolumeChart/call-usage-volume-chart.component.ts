import { EVENT_TAG, CALL_EVENT } from './../../../../services/event/event.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../../services/event/event.service';

@Component({
  selector: 'app-call-usage-volume-chart',
  templateUrl: './call-usage-volume-chart.component.html',
  styleUrls: ['./call-usage-volume-chart.component.scss']
})
export class CallUsageVolumeChartComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() propertyId;

  data = [];
  options;

  @Input() resolution;
  @Input() startDate;
  @Input() endDate;
  @Input() tag;
  @Output() goDeeperEventEmitter = new EventEmitter<any>();

  systemEventTypes = new Set<string>();

  constructor(
    private translateService: TranslateService,
    private eventService: EventService,
    dateService: DateService) {

    super(dateService);
    this.translateService.onLangChange.subscribe((event) => {
      this.reloadDataAndChart();
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
    this.eventService.getReportByTag(this.propertyId, tag, this.resolution.toUpperCase(), EVENT_TAG.CALL_EVENT, null, this.startDate, this.endDate,
      null, null, { 'eventType': 'ENUM'}, true).subscribe((res) => {
        this.data = [];
        this.reloadChartOptions();
        this.buildChartData(res);
      });
  }

  buildChartData(reports: Array<any>){
    let callEvents = [];
    reports = reports.reverse();

    let lastXAxisNumber = null;
    reports.forEach((report) => {
      let timestamp = new Date(report.date);
      report['timestamp'] = timestamp;
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      if(lastXAxisNumber != null){
        while(xAxisNumber - lastXAxisNumber > 1){
          lastXAxisNumber++;
          callEvents.push({x: lastXAxisNumber, y: 0});
        }
      }


      /** ------------------- CALL EVENTS DATA ------------------*/
      let eventTypes: Object = report['eventType'];
      // lets fill systemEventTypes set
      // with all received eventTypes
      for (var eventDeviceType in eventTypes) {
        if (eventTypes.hasOwnProperty(eventDeviceType)) {
          this.systemEventTypes.add(eventDeviceType);
        }
      }
      //and use aux array
      callEvents.push({ x: xAxisNumber, eventTypes, timestamp: timestamp });

      lastXAxisNumber = xAxisNumber;
    });

    
        /** -------------------DEVICE TYPE DATA ------------------*/
    // let ret = [];
    // then, for each deviceType in set
    // lets get data for each report received
    // naturally, in some cases it can be zero
    this.systemEventTypes.forEach(systemEventType => {
      let values = [];
      callEvents.forEach(data => {
        let eventTypeCount = data.eventTypes[systemEventType];
        if (eventTypeCount == null) { eventTypeCount = 0; }
        values.push({ x: data.x, y: eventTypeCount, info: { timestamp: data.timestamp, callEventType: systemEventType } });
      });

      let eventTypeData = {};
      eventTypeData['key'] = this.translateService.instant(systemEventType);;
      
      let color = this.getCallColor(systemEventType);
      if(color != null){
        eventTypeData['color'] = color;
      }

      eventTypeData['values'] = values;
      eventTypeData['type'] = 'bar';
      eventTypeData['yAxis'] = 1;
      this.data.push(eventTypeData);

    });

  }

  getCallColor(eventType){
    if(eventType == CALL_EVENT.MISSED_CALL){
      //red
      return '#bb3434de'
    } else if(eventType == CALL_EVENT.REJECTED_CALL){
      return 'rgba(187, 123, 52, 0.74)'
    } else if(eventType == CALL_EVENT.ANSWERED_CALL){
      return 'rgba(92, 185, 56, 0.59)'
    }

    return null;
  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 300,
        margin: {
          top: 50,
          right: 75,
          bottom: 60,
          left: 75
        },
        clipEdge: true,
        duration: 500,
        tooltips: true,
        stacked: false,
        showControls: false,
        interpolate: 'cardinal',
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
