import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { DataService, TraceType } from '../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { DndService } from '../../services/dndService/dnd-service.service';
import { RealTime } from '../../abstracts/realTime';

@Component({
  selector: 'housekeeping-dnd-state-chart',
  templateUrl: './dnd-state-chart.component.html',
  styleUrls: ['./dnd-state-chart.component.less']
})
export class DndStateChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() unitTraceMap;
  @Input() dateToAcceptData;
  @Input() propertyId;

  realTime;

  dndLastTracesMap;

  // chart configs
  options;
  data;

  doNotDisturbRooms;
  makeUpRooms;;
  noneStateRooms;
  notAvailableDataRooms

  constructor(private dndService: DndService, private translateService: TranslateService) {
    super();
    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnChanges() {

    if (!this.unitTraceMap) {
      return;
    }

    if (this.realTime == null) {
      this.realTime = new RealTime();
      this.data = new Array();
      this.realTime.startGettingRealTimeData(() => {
        this.getData();
      });
    }

  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
  }

  getData() {
    this.reloadChartOptions();

    this.dndService.getDndMap(this.propertyId, this.unitTraceMap, this.dateToAcceptData, () => {
      this.buildData();
    });
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        height: 300,
        donut: true,
        valueFormat: function (d) {
          return d3.format('.0f')(d);
        },
        legendPosition: 'bottom',
        callback: (chart) => {
          chart.pie.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        },
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,
        pie: {
          startAngle: function (d) { return d.startAngle },
          endAngle: function (d) { return d.endAngle }
        },
        duration: 500,
        legend: {
          margin: {
            top: 8,
            right: 15,
            bottom: 20,
            left: 0
          }
        }
      }
    };
  }

  onChartClick(chartData) {
    super.onChartClick(chartData.data, chartData.key);
  }

  buildData() {

    this.doNotDisturbRooms = [];
    this.makeUpRooms = [];
    this.noneStateRooms = [];
    this.notAvailableDataRooms = [];

    for (var property in this.unitTraceMap) {
      if (this.unitTraceMap.hasOwnProperty(property)) {
        let currentLastDndTrace = this.unitTraceMap[property];
        let state = currentLastDndTrace['state'];

        //if state is null
        // or date is too old
        // lets consider it as a not available device
        if (state == null || currentLastDndTrace['timestamp'] < this.dateToAcceptData) {
          //first lets check if we have recent data
          this.notAvailableDataRooms.push(currentLastDndTrace);
        } else {
          if (state == 'do-not-disturb') {
            this.doNotDisturbRooms.push(currentLastDndTrace);
          } else if (state == 'make-up-room') {
            this.makeUpRooms.push(currentLastDndTrace);
          } else if (state == 'none') {
            this.noneStateRooms.push(currentLastDndTrace);
          }
        }
      }
    }

    this.translateService.get(['do-not-disturb', 'make-up-room', 'none', 'Not Available']).subscribe((translations) => {
      let res = [];
      res.push({ key: translations['do-not-disturb'], y: this.doNotDisturbRooms.length, data: this.doNotDisturbRooms, color: 'rgba(239, 83, 80, 1)' });
      res.push({ key: translations['make-up-room'], y: this.makeUpRooms.length, data: this.makeUpRooms, color: '#00dca9' });
      res.push({ key: translations['none'], y: this.noneStateRooms.length, data: this.noneStateRooms, color: 'rgb(169, 169, 169)' });
  
      if (this.notAvailableDataRooms.length > 0) {
        res.push({ key: translations['Not Available'], y: this.notAvailableDataRooms.length, data: this.notAvailableDataRooms, color: '#333c49' });
      }
      this.data = res;
    });
  }

}
