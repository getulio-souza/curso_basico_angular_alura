import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AbstractChartActions} from '../../abstracts/abstractChartActions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mult-chart-events',
  templateUrl: './mult-chart-events.component.html',
  styleUrls: ['./mult-chart-events.component.scss']
})
export class MultChartEventsComponent extends AbstractChartActions implements OnInit, OnChanges {

  data;
  options;
  @Input() chartNumber;

  constructor() {
    super();
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  ngOnInit() {
  }


  updateChart() {
    this.data = new Array();
    this.reloadChartOptions();
    this.data = this.buildData();
  }

  reloadChartOptions() {
    const months = ['Jan', 'Fev', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
        height: 300,
        interpolate: 'cardinal',
        showLegend: true,
        yDomain1: [0, 70],
        useInteractiveGuideline: true,
        duration: 500,
        xAxis: {
          tickPadding: 20,
          showMaxMin: false,
          tickFormat: function (d) {
            return months[d - 1];
          }
        },
        yAxis1: {
          trickPadding: 10,
          axisLabel: '%',
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.format('.0f')(d);
          }
        }
      }
    };
  }

  // graph Open
  buildOpenHistoricLine() {
    const buildOpenHistoricLineValues = [];
    buildOpenHistoricLineValues.push({x: 1, y: 15});
    buildOpenHistoricLineValues.push({x: 2, y: 30});
    buildOpenHistoricLineValues.push({x: 3, y: 40});
    buildOpenHistoricLineValues.push({x: 4, y: 35});
    buildOpenHistoricLineValues.push({x: 5, y: 25});
    buildOpenHistoricLineValues.push({x: 6, y: 22});
    buildOpenHistoricLineValues.push({x: 7, y: 30});
    buildOpenHistoricLineValues.push({x: 8, y: 45});
    buildOpenHistoricLineValues.push({x: 9, y: 50});
    buildOpenHistoricLineValues.push({x: 10, y: 48});
    buildOpenHistoricLineValues.push({x: 11, y: 42});
    buildOpenHistoricLineValues.push({x: 12, y: 38});

    const OpenHistoricLine = {};
    OpenHistoricLine['key'] = 'Historical Events';
    OpenHistoricLine['color'] = '#24a0ff';
    OpenHistoricLine['values'] = buildOpenHistoricLineValues;
    OpenHistoricLine['type'] = 'line';
    OpenHistoricLine['yAxis'] = 1;

    return OpenHistoricLine;
  }
  buildOpenHistoricArea() {
    const buildOpenHistoricAreaValues = [];
    buildOpenHistoricAreaValues.push({x: 1, y: 25});
    buildOpenHistoricAreaValues.push({x: 2, y: 25});
    buildOpenHistoricAreaValues.push({x: 3, y: 25});
    buildOpenHistoricAreaValues.push({x: 4, y: 25});
    buildOpenHistoricAreaValues.push({x: 6, y: 25});
    buildOpenHistoricAreaValues.push({x: 5, y: 25});
    buildOpenHistoricAreaValues.push({x: 7, y: 25});
    buildOpenHistoricAreaValues.push({x: 8, y: 25});
    buildOpenHistoricAreaValues.push({x: 9, y: 25});
    buildOpenHistoricAreaValues.push({x: 10, y: 25});
    buildOpenHistoricAreaValues.push({x: 11, y: 25});
    buildOpenHistoricAreaValues.push({x: 12, y: 25});

    const OpenHistoricArea = {};
    OpenHistoricArea['key'] = 'Average';
    OpenHistoricArea['color'] = 'rgba(255,255,255,.5)';
    OpenHistoricArea['values'] = buildOpenHistoricAreaValues;
    OpenHistoricArea['type'] = 'area';
    OpenHistoricArea['yAxis'] = 1;

    return OpenHistoricArea;
  }

  // graph In Progress
  buildInProgressHistoricLine() {
    const buildInProgressHistoricLineValues = [];
    buildInProgressHistoricLineValues.push({x: 1, y: 15});
    buildInProgressHistoricLineValues.push({x: 2, y: 30});
    buildInProgressHistoricLineValues.push({x: 3, y: 50});
    buildInProgressHistoricLineValues.push({x: 4, y: 45});
    buildInProgressHistoricLineValues.push({x: 5, y: 35});
    buildInProgressHistoricLineValues.push({x: 6, y: 32});
    buildInProgressHistoricLineValues.push({x: 7, y: 40});
    buildInProgressHistoricLineValues.push({x: 8, y: 55});
    buildInProgressHistoricLineValues.push({x: 9, y: 30});
    buildInProgressHistoricLineValues.push({x: 10, y: 38});
    buildInProgressHistoricLineValues.push({x: 11, y: 32});
    buildInProgressHistoricLineValues.push({x: 12, y: 58});

    const inProgressHistoricLine = {};
    inProgressHistoricLine['key'] = 'Historical Events';
    inProgressHistoricLine['color'] = '#b9d01a';
    inProgressHistoricLine['values'] = buildInProgressHistoricLineValues;
    inProgressHistoricLine['type'] = 'line';
    inProgressHistoricLine['yAxis'] = 1;

    return inProgressHistoricLine;
  }
  buildInProgressHistoricArea() {
    const buildInProgressHistoricAreaValues = [];
    buildInProgressHistoricAreaValues.push({x: 1, y: 30});
    buildInProgressHistoricAreaValues.push({x: 2, y: 30});
    buildInProgressHistoricAreaValues.push({x: 3, y: 30});
    buildInProgressHistoricAreaValues.push({x: 4, y: 30});
    buildInProgressHistoricAreaValues.push({x: 6, y: 30});
    buildInProgressHistoricAreaValues.push({x: 5, y: 30});
    buildInProgressHistoricAreaValues.push({x: 7, y: 30});
    buildInProgressHistoricAreaValues.push({x: 8, y: 30});
    buildInProgressHistoricAreaValues.push({x: 9, y: 30});
    buildInProgressHistoricAreaValues.push({x: 10, y: 30});
    buildInProgressHistoricAreaValues.push({x: 11, y: 30});
    buildInProgressHistoricAreaValues.push({x: 12, y: 30});

    const OpenHistoricArea = {};
    OpenHistoricArea['key'] = 'Average';
    OpenHistoricArea['color'] = 'rgba(255,255,255,.5)';
    OpenHistoricArea['values'] = buildInProgressHistoricAreaValues;
    OpenHistoricArea['type'] = 'area';
    OpenHistoricArea['yAxis'] = 1;

    return OpenHistoricArea;
  }

  // graph Pending
  buildPendingHistoricLine() {
    const buildPendingHistoricLineValues = [];
    buildPendingHistoricLineValues.push({x: 1, y: 20});
    buildPendingHistoricLineValues.push({x: 2, y: 30});
    buildPendingHistoricLineValues.push({x: 3, y: 40});
    buildPendingHistoricLineValues.push({x: 4, y: 45});
    buildPendingHistoricLineValues.push({x: 5, y: 35});
    buildPendingHistoricLineValues.push({x: 6, y: 22});
    buildPendingHistoricLineValues.push({x: 7, y: 30});
    buildPendingHistoricLineValues.push({x: 8, y: 45});
    buildPendingHistoricLineValues.push({x: 9, y: 40});
    buildPendingHistoricLineValues.push({x: 10, y: 48});
    buildPendingHistoricLineValues.push({x: 11, y: 22});
    buildPendingHistoricLineValues.push({x: 12, y: 18});

    const pendingHistoricLine = {};
    pendingHistoricLine['key'] = 'Historical Events';
    pendingHistoricLine['color'] = '#e84d4d';
    pendingHistoricLine['values'] = buildPendingHistoricLineValues;
    pendingHistoricLine['type'] = 'line';
    pendingHistoricLine['yAxis'] = 1;

    return pendingHistoricLine;
  }
  buildPendingHistoricArea() {
    const buildPendingHistoricAreaValues = [];
    buildPendingHistoricAreaValues.push({x: 1, y: 20});
    buildPendingHistoricAreaValues.push({x: 2, y: 20});
    buildPendingHistoricAreaValues.push({x: 3, y: 20});
    buildPendingHistoricAreaValues.push({x: 4, y: 20});
    buildPendingHistoricAreaValues.push({x: 6, y: 20});
    buildPendingHistoricAreaValues.push({x: 5, y: 20});
    buildPendingHistoricAreaValues.push({x: 7, y: 20});
    buildPendingHistoricAreaValues.push({x: 8, y: 20});
    buildPendingHistoricAreaValues.push({x: 9, y: 20});
    buildPendingHistoricAreaValues.push({x: 10, y: 20});
    buildPendingHistoricAreaValues.push({x: 11, y: 20});
    buildPendingHistoricAreaValues.push({x: 12, y: 20});

    const pendingHistoricArea = {};
    pendingHistoricArea['key'] = 'Average';
    pendingHistoricArea['color'] = 'rgba(255,255,255,.5)';
    pendingHistoricArea['values'] = buildPendingHistoricAreaValues;
    pendingHistoricArea['type'] = 'area';
    pendingHistoricArea['yAxis'] = 1;

    return pendingHistoricArea;
  }

  // graph Done
  buildDoneHistoricLine() {
    const buildDoneHistoricLineValues = [];
    buildDoneHistoricLineValues.push({x: 1, y: 15});
    buildDoneHistoricLineValues.push({x: 2, y: 30});
    buildDoneHistoricLineValues.push({x: 3, y: 50});
    buildDoneHistoricLineValues.push({x: 4, y: 45});
    buildDoneHistoricLineValues.push({x: 5, y: 35});
    buildDoneHistoricLineValues.push({x: 6, y: 32});
    buildDoneHistoricLineValues.push({x: 7, y: 40});
    buildDoneHistoricLineValues.push({x: 8, y: 55});
    buildDoneHistoricLineValues.push({x: 9, y: 30});
    buildDoneHistoricLineValues.push({x: 10, y: 38});
    buildDoneHistoricLineValues.push({x: 11, y: 32});
    buildDoneHistoricLineValues.push({x: 12, y: 18});

    const doneHistoricLine = {};
    doneHistoricLine['key'] = 'Historical Events';
    doneHistoricLine['color'] = '#1C8F7B';
    doneHistoricLine['values'] = buildDoneHistoricLineValues;
    doneHistoricLine['type'] = 'line';
    doneHistoricLine['yAxis'] = 1;

    return doneHistoricLine;
  }
  buildDoneHistoricArea() {
    const buildDoneHistoricAreaValues = [];
    buildDoneHistoricAreaValues.push({x: 1, y: 35});
    buildDoneHistoricAreaValues.push({x: 2, y: 35});
    buildDoneHistoricAreaValues.push({x: 3, y: 35});
    buildDoneHistoricAreaValues.push({x: 4, y: 35});
    buildDoneHistoricAreaValues.push({x: 6, y: 35});
    buildDoneHistoricAreaValues.push({x: 5, y: 35});
    buildDoneHistoricAreaValues.push({x: 7, y: 35});
    buildDoneHistoricAreaValues.push({x: 8, y: 35});
    buildDoneHistoricAreaValues.push({x: 9, y: 35});
    buildDoneHistoricAreaValues.push({x: 10, y: 35});
    buildDoneHistoricAreaValues.push({x: 11, y: 35});
    buildDoneHistoricAreaValues.push({x: 12, y: 35});

    const doneHistoricArea = {};
    doneHistoricArea['key'] = 'Average';
    doneHistoricArea['color'] = 'rgba(255,255,255,.5)';
    doneHistoricArea['values'] = buildDoneHistoricAreaValues;
    doneHistoricArea['type'] = 'area';
    doneHistoricArea['yAxis'] = 1;

    return doneHistoricArea;
  }

  buildData() {
    const dataChart = [];

    // chart Open
    const buildOpenHistoricLine = this.buildOpenHistoricLine();
    const buildOpenHistoricArea = this.buildOpenHistoricArea();
    // chart In Progress
    const buildInProgressHistoricLine = this.buildInProgressHistoricLine();
    const buildInProgressHistoricArea = this.buildInProgressHistoricArea();
    // chart In Progress
    const buildPendingHistoricLine = this.buildPendingHistoricLine();
    const buildPendingHistoricArea = this.buildPendingHistoricArea();
    // chart Done
    const buildDoneHistoricLine = this.buildDoneHistoricLine();
    const buildDoneHistoricArea = this.buildDoneHistoricArea();

    switch (this.chartNumber) {
      case 2:
        dataChart.push(buildInProgressHistoricLine);
        dataChart.push(buildInProgressHistoricArea);
        break;

      case 3:
        dataChart.push(buildPendingHistoricLine);
        dataChart.push(buildPendingHistoricArea);
        break;
      case 4:
        dataChart.push(buildDoneHistoricLine);
        dataChart.push(buildDoneHistoricArea);
        break;

      default:
        dataChart.push(buildOpenHistoricLine);
        dataChart.push(buildOpenHistoricArea);
    }

    return dataChart;
  }

}
