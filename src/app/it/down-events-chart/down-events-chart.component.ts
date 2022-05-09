import { AbstractChartActions } from './../../abstracts/abstractChartActions';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'it-down-events-chart',
  templateUrl: './down-events-chart.component.html',
  styleUrls: ['./down-events-chart.component.less']
})
export class DownEventsChartComponent extends AbstractChartActions implements OnInit {

  options;
  data;

  downEvents;

  constructor() {
    super();
  }

  ngOnInit() {
    this.data = new Array();
    this.reloadChartOptions();
    this.data = this.getDownEvents();
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 350,
        margin: {
          top: 0,
          right: 0,
          left: 200,
        },
        showMaxMin: true,
        clipEdge: true,
        duration: 500,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: '',
          tickFormat: (d) => {
            let date = new Date(d);
            return date.toLocaleTimeString() + " - " + date.toLocaleDateString();
          }
        },
        yAxis: {
          axisLabel: 'minutes',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d);
          }
        },
        callback: (chart) => {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data);
          });
        },
      }
    };
  }

  onChartClick(event) {
  }

  getDownEvents() {
    
    let lessThan10min = [
      { name: "Event E", timestamp: 1544521048000, x: 1544521048000, y: 8  }
    ]
    
    let lessThan1Hour = [
      { name: "Event A", timestamp: 1544546248000, x: 1544546248000, y: 45 },
      { name: "Event B", timestamp: 1544531848000, x: 1544531848000, y: 30  }
    ];

    let moreThan1Hour = [
      { name: "Event C", timestamp: 1544470648000, x: 1544470648000, y: 65  },
      { name: "Event D", timestamp: 1544528248000, x: 1544528248000, y: 88  },
    ];
   

  


    return [
      {
        key: '> 60 min',
        values: moreThan1Hour,
        color: '#ef5350'
      },
      {
        key: '10 min < down < 60 min',
        values: lessThan1Hour,
        color: 'rgba(229, 173, 21, 1)'
      },
      {
        key: 'down < 10 min',
        values: lessThan10min,
        color: 'rgba(245, 249, 1, 1)'
      }
    ];


  }



}
