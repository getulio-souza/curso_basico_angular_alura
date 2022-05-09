
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AbstractThirtyDays } from '../../abstracts/abstractThirtyDays';
import { DataService, TraceType } from '../../services/data/data.service';
import { DateService } from '../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'relay-presence-chart',
  templateUrl: './relay-presence-chart.component.html',
  styleUrls: ['./relay-presence-chart.component.css']
})
export class RelayPresenceChartComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() propertyId: string;
  @Input() tag: string;
  
  constructor(dateService: DateService,
    private dataService: DataService,
    private translateService: TranslateService) {

    super(dateService);
    // temporary settings while we have performance issues to use monthly view as default (resolution = 'day')
    this.resolution = 'hour';
    this.startDate = dateService.getStartCurrentDay();
    this.endDate = dateService.getCurrentTime();
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnChanges() {
    if (this.propertyId) {
      this.getData();
    }
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 300,
        margin: {
          top: 0,
          right: 0
        },
        clipEdge: true,
        duration: 500,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        yAxis: {
          axisLabel: '%',
          axisLabelDistance: -15,
          showMaxMin: false,
          tickFormat: function (value) {
            return value;
          }
        },
        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.info);
          });
        }
      }
    };
  }

  onChartClick(info) {
    this.goDeeper(info);
  }  

  getData() {
    const requests = [];
    if(this.tag == null){
      this.tag = this.propertyId;
    }
    requests.push(this.getRelayReport(this.tag));
    requests.push(this.getPresenceReport(this.tag));
    forkJoin(requests).subscribe( (res: Array<Array<any>>) => {
      this.buildChartData(res);
    });
  }

  

  getRelayReport(tag) {
    return this.dataService.getReportByOwnerAndTag(
      this.propertyId,
      tag,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null,
      {
        'state.on': 'SUM',
        'state.off': 'SUM'
      },
      TraceType.RELAY_NORM);
  }

  getPresenceReport(tag) {
    return this.dataService.getReportByOwnerAndTag(
      this.propertyId,
      tag,
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null,
      { 
        'presence.true': 'SUM',
        'presence.false': 'SUM',
        'presence.N/A': 'SUM',

        'pmsState.sold': 'SUM',
        'pmsState.unsold': 'SUM',
        'pmsState.blocked': 'SUM',
        'pmsState.N/A': 'SUM'
      
      },

      TraceType.UNIT_NORM);
  }


  buildChartData(res: Array<Array<any>>) {

    let relayReport = res[0];
    let presenceReport = res[1];

    let ret = [];
    const colorConsumption = '#ef5350';
    const colorSavings = '#66bb6a';
    const colorPresence = '#66bb6a';
    const colorSold = '#7786dcc4';

    const consumptionValues = this.buildConsumptionValues(relayReport);
    const savingsValues = this.buildSavingsValues(presenceReport, consumptionValues);
    const buildPresenceAndSoldValues = this.buildPresenceAndSoldValues(presenceReport, consumptionValues);
    const presenceValues = buildPresenceAndSoldValues['presence'];
    const soldValues = buildPresenceAndSoldValues['sold'];

    this.translateService.get(["Consumption", "Savings", "Presence", "Sold"]).subscribe(translations => {
      this.data = [];
      this.data.push({
        key: translations["Consumption"],
        values: consumptionValues,
        color: colorConsumption
      });
      // this.data.push({
      //   key: translations["Savings"],
      //   values: savingsValues,
      //   color: colorSavings
      // });
      this.data.push({
        key: translations["Presence"],
        values: presenceValues,
        color: colorPresence
      });
      this.data.push({
        key: translations["Sold"],
        values: soldValues,
        color: colorSold
      });

      this.reloadChartOptions();
    })

    return ret;
  }


  buildConsumptionValues(relayReport: Array<any>) {
    const consumptionValues = [];

    for (let i = 0; i < relayReport.length; i++) {
      const result = relayReport[i];
        
      result['timestamp'] = result['date'];

      let consumptionPercent = 0;

      let stateOnRuntime = result['state.on'];
      let stateOffRuntime = result['state.off'];
      if (stateOnRuntime != null && stateOffRuntime != null) {
        let totalRuntime =  stateOnRuntime + stateOffRuntime;
        consumptionPercent = Math.round(100 * stateOnRuntime / totalRuntime);
      }

      result['label'] = Math.round(consumptionPercent);

      const date = new Date(result['timestamp']);
      let xAxis = this.getXAxis(date);

      consumptionValues.push({ key: xAxis, x: xAxis, y: consumptionPercent, info: result });
    }
    return consumptionValues;
  }

  buildPresenceAndSoldValues(presenceReport: Array<any>, consumptionValues: Array<any>) {
    const presenceValues = [];
    const soldValues = [];

    for (let i = 0, j = 0; i < consumptionValues.length; i++) {
      const consumptionValue = consumptionValues[i];
      const timestamp = consumptionValue.info.timestamp;
      j = this.findTimestampIndex(presenceReport, timestamp, j);

      let presencePercent = 0;
      let result = {};

      let soldPercent = 0;
      
      if (j != -1 && j < presenceReport.length) {
        result = presenceReport[j];

        // presence
        const presenceOnRuntime = result['presence.true'] ? result['presence.true'] : 0 ;
        const presenceOffRuntime = result['presence.false'] ? result['presence.false'] : 0 ;
        const presenceNaRuntime = result['presence.N/A'] ? result['presence.N/A'] : 0 ;

        const totalRuntimePresence =  presenceOnRuntime + presenceOffRuntime + presenceNaRuntime;

        if (totalRuntimePresence != 0) {
          presencePercent = Math.round(100 * presenceOnRuntime / totalRuntimePresence);
        }


        // pms State (sold/unsold/blocked)
        const soldRuntime = result['pmsState.sold'] != null ? result['pmsState.sold'] : 0 ;
        const unsoldRuntime = result['pmsState.unsold'] != null ? result['pmsState.unsold'] : 0 ;
        const blockedRuntime = result['pmsState.blocked'] != null ? result['pmsState.blocked'] : 0 ;
        const pmsStateNaRunTime = result['pmsState.N/A'] != null ? result['pmsState.N/A'] : 0 ;

        const totalRuntimeSold = soldRuntime + unsoldRuntime + blockedRuntime + pmsStateNaRunTime;
        if(totalRuntimeSold != 0) {
          soldPercent = Math.round(100 * soldRuntime / totalRuntimeSold);
        }
   

      }

      result['timestamp'] = timestamp;
      result['label'] = Math.round(presencePercent);

      const date = new Date(result['timestamp']);
      let xAxis = this.getXAxis(date);

      presenceValues.push({ key: xAxis, x: xAxis, y: presencePercent, info: result });
      soldValues.push({ key: xAxis, x: xAxis, y: soldPercent, info: result });
    }
    return {
          presence: presenceValues,
          sold: soldValues
    }
  }

  buildSavingsValues(presenceReport: Array<any>, consumptionValues: Array<any>) {
    const savingsValues = [];

    for (let i = 0, j = 0; i < consumptionValues.length; i++) {
      const consumptionValue = consumptionValues[i];
      const timestamp = consumptionValue.info.timestamp;
      j = this.findTimestampIndex(presenceReport, timestamp, j);

      let savingsPercent = 0;
      let result = {};

      if (j != -1 && j < presenceReport.length) {
        result = presenceReport[j];
        const nonConsumptionPercent = 100 - consumptionValue.y;
        if (result['total'] > 0 && result['occupancy'] && result['occupancy']['false'] > 0) {
          const presencePercent = Math.round(100 * result['occupancy']['false'] / result['total']);
          savingsPercent = Math.min(presencePercent, nonConsumptionPercent);
        }
      }

      result['timestamp'] = timestamp;
      result['label'] = Math.round(savingsPercent);

      const date = new Date(result['timestamp']);
      let xAxis = this.getXAxis(date);

      savingsValues.push({ key: xAxis, x: xAxis, y: savingsPercent, info: result });
    }
    return savingsValues;
  }

  findTimestampIndex(report: Array<any>, timestamp, iStart) {
    for (let i = iStart; i != -1 && i < report.length; i++) {
      const reportTimestamp = report[i].date;
      if (reportTimestamp == timestamp) {
        return i;
      }
    }
    return -1;
  }

}
