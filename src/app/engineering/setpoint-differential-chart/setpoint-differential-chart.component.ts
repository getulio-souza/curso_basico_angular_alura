import { AbstractChartActions } from '../../abstracts/abstractChartActions';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { RealTime } from '../../abstracts/realTime';
import { ThermostatService } from '../../services/thermostatService/thermostat.service';

@Component({
  selector: 'engineering-setpoint-differential-chart',
  templateUrl: './setpoint-differential-chart.component.html',
  styleUrls: ['./setpoint-differential-chart.component.less']
})
export class SetpointDifferentialChartComponent extends AbstractChartActions implements OnChanges, OnDestroy {

  @Input() propertyId;
  @Input() temperatureUomIsFahrenheit;
  @Input() structure;
  @Input() dateToAcceptData;

  lastTraces;
  realTime: RealTime;

  // chart configs
  options;
  data;

  notAvailableDataRooms;
  diffMap;

  constructor(private thermostatService: ThermostatService) { super(); }

  ngOnChanges() {
    if (!this.structure) {
      return;
    }

    if (!this.realTime) {
      this.realTime = new RealTime();
      this.realTime.startGettingRealTimeData(() => {
        this.thermostatService.getLastTracesThermostatData(
            this.propertyId, this.propertyId, this.structure, this.dateToAcceptData, this.temperatureUomIsFahrenheit)
            .subscribe((lastThermostatTraces) => {
          this.lastTraces = lastThermostatTraces;
          this.data = new Array();
          this.reloadChartOptions();
          this.data = this.buildData();
        })
      });
    }
  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: "400",
        margin: {
          top: 50,
          right: 0
        },
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: 'Diff Temp',
          showMaxMin: true,
          tickFormat: function (d) { return d; }
        },
        yAxis: {
          axisLabel: 'Thermostats',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d * 100) / 100
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

  onChartClick(chartData) {
    super.onChartClick(chartData.data, null);
  }

  buildData() {

    this.diffMap = {};
    this.prepareDiffMap();

    let resCooling = [];
    let resHeating = [];
    let resAuto = [];
    let resOff = [];

    let diffKeys = this.prepareDiffTempKeys();

    diffKeys.forEach(diffKey => {
      let rooms = this.diffMap[diffKey];
      let heating = [];
      let coolingRooms = [];
      let autoRooms = [];
      let offRooms = [];

      for (let i = 0; i < rooms.length; i++) {
        //for each room, lets build modes arrays
        let room = rooms[i];
        if (room['mode'] == 'cool') {
          coolingRooms.push(room);
        } else if (room['mode'] == 'heat') {
          heating.push(room);
        } else if (room['mode'] == 'auto') {
          autoRooms.push(room);
        } else if (room['mode'] == 'off') {
          offRooms.push(room);
        }
      }

      if (coolingRooms.length > 0 || heating.length > 0 || autoRooms.length > 0) {
        //if for this diffKey has at least one mode, lets show on chart
        resCooling.push({ x: diffKey, y: coolingRooms.length, data: coolingRooms });
        resHeating.push({ x: diffKey, y: heating.length, data: heating });
        resAuto.push({ x: diffKey, y: autoRooms.length, data: autoRooms });
        resOff.push({ x: diffKey, y: offRooms.length, data: offRooms });
      }
    });

    // we are not returning resOff (off mode hvacs)
    return [
      {
        key: 'Cooling',
        values: resCooling,
        color: '#32A8E5'
      },
      {
        key: 'Heating',
        values: resHeating,
        color: '#CC2500'
      },
      {
        key: 'Auto',
        values: resAuto,
        color: '#329C8A'
      },
    ]


  }

  private prepareDiffMap() {

    this.lastTraces.forEach(lastTrace => {
      if (lastTrace['timestamp'] > this.dateToAcceptData) {

        if (lastTrace['active-profile-label'] === 'unsold' || lastTrace['presence'] === 'false') {
          //to only show rooms that are sold AND occupied
          return ;
        }

        let setpoint;
        let temperature;

        if(this.temperatureUomIsFahrenheit) {
          setpoint = lastTrace['setpointF'];
          temperature = lastTrace['temperatureF'];
        } else {
          setpoint = lastTrace['setpoint'];
          temperature = lastTrace['temperature'];
        }

        let diffTemp = Math.round(temperature - setpoint);

        if (this.diffMap[diffTemp] == null) {
          this.diffMap[diffTemp] = [];
        }
        this.diffMap[diffTemp].push(lastTrace);
      }
    });
  }
  private prepareDiffTempKeys(): Array<any> {
    let diffKeys = [];
    for (var diffTemp in this.diffMap) {
      if (this.diffMap.hasOwnProperty(diffTemp)) {
        diffKeys.push(Number(diffTemp));
      }
    }

    diffKeys.sort((a, b) => { return a - b; });
    return diffKeys;
  }

}
