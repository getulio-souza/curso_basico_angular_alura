import {AbstractChartActions} from './../../abstracts/abstractChartActions';
import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'chart-floor-plain',
  templateUrl: './chart-floor-plain.component.html',
  styleUrls: ['./chart-floor-plain.component.scss']
})
export class ChartFloorPlainComponent extends AbstractChartActions implements OnInit, OnChanges {

  data;
  options;

  @Input() chartNumber;

  constructor() {
    super();
    this.updateChart();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.data = new Array();
    this.reloadChartOptions();
    this.data = this.buildData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
        height: 350,
        interpolate: 'cardinal',
        stacked: true,
        showYAxis: false,
        showLegend: false,
        useInteractiveGuideline: true,
        duration: 500,
        showControls: false,
        legend: {
          align: false
        },
        margin: {
          top: 80
        },
        xAxis: {
          tickPadding: 10,
          tickFormat: function (d) {
            return (d);
          }
        },
        yAxis1: {
          tickFormat: function (d) {
            return (d);
          }
        }
      }
    };
  }

  buildSold() {
    const buildSoldValues = [];
    buildSoldValues.push({x: 1, y: 0});
    buildSoldValues.push({x: 2, y: 7});
    buildSoldValues.push({x: 3, y: 5});
    buildSoldValues.push({x: 4, y: 7.8});
    buildSoldValues.push({x: 5, y: 9.5});
    buildSoldValues.push({x: 6, y: 10});
    buildSoldValues.push({x: 7, y: 2.1});
    buildSoldValues.push({x: 8, y: 8});
    buildSoldValues.push({x: 9, y: 8.2});
    buildSoldValues.push({x: 10, y: 9.9});
    buildSoldValues.push({x: 11, y: 6.5});
    buildSoldValues.push({x: 12, y: 7.7});

    const soldFloor = {};
    soldFloor['key'] = 'TV';
    soldFloor['color'] = '#00dca9';
    soldFloor['values'] = buildSoldValues;
    soldFloor['type'] = 'line';
    soldFloor['yAxis'] = 1;

    return soldFloor;
  }

  buildFloorAvarage() {
    const buildFloorAvarageValues = [];
    buildFloorAvarageValues.push({x: 1, y: 0});
    buildFloorAvarageValues.push({x: 2, y: 5});
    buildFloorAvarageValues.push({x: 3, y: 5});
    buildFloorAvarageValues.push({x: 4, y: 5});
    buildFloorAvarageValues.push({x: 5, y: 5});
    buildFloorAvarageValues.push({x: 6, y: 5});
    buildFloorAvarageValues.push({x: 7, y: 5});
    buildFloorAvarageValues.push({x: 8, y: 5});
    buildFloorAvarageValues.push({x: 9, y: 5});
    buildFloorAvarageValues.push({x: 10, y: 5});
    buildFloorAvarageValues.push({x: 11, y: 5});
    buildFloorAvarageValues.push({x: 12, y: 5});

    const soldFloorAvarage = {};
    soldFloorAvarage['key'] = 'Attempt';
    soldFloorAvarage['color'] = 'rgba(255,255,255, .2)';
    soldFloorAvarage['values'] = buildFloorAvarageValues;
    soldFloorAvarage['type'] = 'area';
    soldFloorAvarage['yAxis'] = 1;

    return soldFloorAvarage;
  }


  buildData() {
    const dataChart = [];

    const soldFloor = this.buildSold();
    const soldFloorAvarage = this.buildFloorAvarage();


    dataChart.push(soldFloor);
    dataChart.push(soldFloorAvarage);

    return dataChart;
  }
}
