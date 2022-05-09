import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-graph-hvac-real-time',
  templateUrl: './graph-hvac-real-time.component.html',
  styleUrls: ['./graph-hvac-real-time.component.css']
})
export class GraphHvacRealTimeComponent implements OnInit, OnChanges {

  @Input() energyGroupId;

  // chart configs
  options;
  data;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'pieChart',
        valueFormat: function(d){
          return d3.format('.0f')(d);
        },
        height: 400,
        donut: true,
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,

        pie: {
          startAngle: function (d) { return d.startAngle / 2 - Math.PI / 2; },
          endAngle: function (d) { return d.endAngle / 2 - Math.PI / 2; }
        },
        duration: 500,
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    };
  }


  getData() {
    this.data = new Array();
    this.reloadChartOptions();

    // TODO - use service.. then
    const results = [];
    this.data = this.buildData(results);
  }

  buildData(results) {

    const on = Math.random() * 100;
    const off = Math.random() * 100;
    const setback = Math.random() * 100;

    return [
      { key: 'On', y: on, color: 'rgba(239, 83, 80,1)' },
      { key: 'Off', y: off, color: 'rgba(200, 200, 200, 1)' },
      { key: 'Setback', y: setback, color: '#66bb6a' }];
  }


}
