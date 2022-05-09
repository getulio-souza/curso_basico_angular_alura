import { AbstractChartActions } from './../../../../abstracts/abstractChartActions';
import { OnInit } from '@angular/core';
import { Component, OnChanges, Input } from '@angular/core';


@Component({
  selector: "home-rating-pie-chart",
  templateUrl: "./rating-pie-chart.component.html",
  styleUrls: ["./rating-pie-chart.component.scss"]
})
export class RatingPieChartComponent extends AbstractChartActions implements OnInit, OnChanges {

  @Input() rating;

  options;
  data;
  color:any;

  constructor() {
    super();
  }

  ngOnInit() {
    this.getData();
  }
  ngOnChanges() {
    this.getData();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: "pieChart",
        height: 140,
        width: 140,
        donut: true,
        growOnHover: false,
        donutRatio: 0.8,
        valueFormat: function(d) {
          return d3.format(".0f")(d);
        },
        legendPosition: "bottom",
        callback: chart => {
          chart.pie.dispatch.on("elementClick", function(e) {
            that.onChartClick(e.data);
          });
        },
        x: function(d) {
          return d.key;
        },
        y: function(d) {
          return d.y;
        },
        showLabels: false,
        showLegend: false,
        pie: {
          startAngle: function(d) {
            return d.startAngle;
          },
          endAngle: function(d) {
            return d.endAngle;
          }
        },
        duration: 500,
        legend: {
          margin: {
            top: 8,
            right: 0,
            bottom: 20,
            left: 0
          }
        }
      }
    };
  }

  getData() {
    this.reloadChartOptions();
    this.data = this.buildData();
  }

  onChartClick(chartData) {
    super.onChartClick(chartData.data, chartData.key);
  }

  buildData() {
    let res = [];

    if ( this.rating <= 3.9 ) { this.color = '#f5b025'; }
    if ( this.rating >= 4 && this.rating <= 4.4 ) { this.color = '#9bdc80'; }
    if ( this.rating >= 4.5 ) { this.color = '#00dda8'; }

    const okCount = this.rating;
    const notOkCount = 5 - this.rating;
    res.push({ key: '', y: okCount, color: this.color });
    res.push({ key: '', y: notOkCount, color: '#1d232b' });

    return res;
  }

}
