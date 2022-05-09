import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date/date.service';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';

@Component({
  selector: 'it-messages-chart',
  templateUrl: './messages-chart.component.html',
  styleUrls: ['./messages-chart.component.less']
})
export class MessagesChartComponent extends AbstractChartActions implements OnInit {

  data;
  options;

  constructor(private dateService: DateService) {
    super();
  }

  ngOnInit() {
    this.reloadChartOptions();
    this.data = this.getMessagesChartData();
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
          axisLabel: 'hour',
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'total messages',
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
   // super.onChartClick(event.events, null);
  }

  getMessagesChartData() {
    let lights = [];
    let tvs = [];
    let curtains = [];
    let hvacs = [];

    lights = this.buildMessages();
    tvs = this.buildMessages();
    curtains = this.buildMessages();
    hvacs = this.buildMessages();

    let ret = [
      {
        key: 'lights',
        values: lights,
        color: '#ef5350'
      }, {
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

  buildMessages() {
    let totalMessages;
    let res = [];

    let hour;
    for (let i = 1; i <= 24; i++) {
      const timestamp = this.dateService.getHoursBefore(24 - i);
      hour = this.dateService.getHour(timestamp);
      totalMessages = Math.round(Math.random() * 10);

      let hourData = {
        x: hour,
        timestamp: new Date(timestamp),
        y: totalMessages,
        events: this.buildFakeEvents(totalMessages)
      }
      res.push(hourData);
    }

    return res;
  }

  buildFakeEvents(totalEvents) {
    let events = [];

    for(let i=0; i < totalEvents; i++){
      let event = {};
      event['type'] = "typeX";
      event['deviceId'] = "deltixboutiquehotel.thermostat" + (i);
      event['deviceType'] = "deltixboutiquehotel.thermostat" + (i);
      event['timestamp'] = new Date().getTime();
      events.push(event);
    }
    return events;
  }

}
