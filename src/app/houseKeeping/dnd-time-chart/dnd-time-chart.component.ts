import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { RealTime } from '../../abstracts/realTime';
import { DndService } from '../../services/dndService/dnd-service.service';

@Component({
  selector: 'housekeeping-dnd-time-chart',
  templateUrl: './dnd-time-chart.component.html',
  styleUrls: ['./dnd-time-chart.component.less']
})
export class DndTimeChartComponent extends AbstractChartActions
  implements OnChanges, OnDestroy {
  @Input() unitTraceMap;
  @Input() dateToAcceptData;
  @Input() propertyId;

  realTime;

  // chart configs
  options;
  data;
  customColumns = [
    { field: 'room', header: 'Name' },
    { field: 'privacyLabel', header: 'State' },
    { field: 'engagedTimeLabel', header: 'DND engaged' }
  ];

  constructor(private dndService: DndService) {
    super();
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
    if (this.realTime) {
      this.realTime.clearInterval();
    }
  }

  getData() {
    this.reloadChartOptions();

    this.dndService.getDndMap(
      this.propertyId,
      this.unitTraceMap,
      this.dateToAcceptData,
      () => {
        this.data = this.buildData();
      }
    );
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 390,
        margin: {
          top: 0,
          right: 50,
          left: 120
        },
        groupSpacing: 0.3,
        showMaxMin: true,
        showValues: true,
        stacked: false,
        tooltip: {
          enabled: false
        },
        showControls: false,
        showLegend: false,
        showXAxis: true,
        yAxis: {
          axisLabelDistance: 0,
          axisLabel: 'rooms',
          tickFormat: function(d) {
            return Math.round(d);
          }
        },
        xAxis: {
          axisLabelDistance: 0,
          tickFormat: function(d) {
            switch (d) {
              case 1:
                return 'up to 5 min';
              case 2:
                return '5-10 min';
              case 3:
                return '10-20 min';
              case 4:
                return '> 20 min';
              default:
                break;
            }
            return Math.round(d);
          }
        },
        valueFormat: function(d) {
          return d3.format('.0f')(d);
        },
        callback: chart => {
          chart.multibar.dispatch.on('elementClick', function(e) {
            that.onChartClick(e.data);
          });
        }
      }
    };
  }

  onChartClick(chartData) {
    super.onChartClick(chartData.data, chartData.name);
  }

  buildData() {
    let totalLessThan5min = 0;
    let tracesLessThan5min = [];

    let totalFiveAndTenMin = 0;
    let tracesFiveAndTenMin = [];

    let totalTenAndTwentyMin = 0;
    let tracesTenAndTwentyMin = [];

    let totalMoreThan20Min = 0;
    let tracesMoreThan20Min = [];

    for (var property in this.unitTraceMap) {
      if (this.unitTraceMap.hasOwnProperty(property)) {
        let lastTrace = this.unitTraceMap[property];
        let state = lastTrace.state;
        if (!state || state != 'make-up-room') {
          continue;
        }

        const stateDuration = lastTrace.stateDuration;

        if (!stateDuration) {
          continue;
        }

        if (stateDuration <= 5 * 60 * 1000) {
          totalLessThan5min++;
          tracesLessThan5min.push(lastTrace);
        } else if (
          stateDuration > 5 * 60 * 1000 &&
          stateDuration <= 10 * 60 * 1000
        ) {
          totalFiveAndTenMin++;
          tracesFiveAndTenMin.push(lastTrace);
        } else if (
          stateDuration > 10 * 60 * 1000 &&
          stateDuration <= 20 * 60 * 1000
        ) {
          totalTenAndTwentyMin++;
          tracesTenAndTwentyMin.push(lastTrace);
        } else {
          totalMoreThan20Min++;
          tracesMoreThan20Min.push(lastTrace);
        }
      }
    }

    const resultValues = [
      {
        y: totalLessThan5min,
        x: 1,
        data: tracesLessThan5min
      },
      {
        y: totalFiveAndTenMin,
        x: 2,
        data: tracesFiveAndTenMin
      },
      {
        y: totalTenAndTwentyMin,
        x: 3,
        data: tracesTenAndTwentyMin
      },
      {
        y: totalMoreThan20Min,
        x: 4,
        data: tracesMoreThan20Min
      }
    ];

    return [
      {
        values: resultValues,
        color: '#70ffde'
      }
    ];
  }
}
