import { StructureService } from '@alis/tracking-ng';
import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { EventService, EVENT_TAG } from '../../../../services/event/event.service';

@Component({
  selector: 'app-call-usage-percent-chart',
  templateUrl: './call-usage-percent-chart.component.html',
  styleUrls: ['./call-usage-percent-chart.scss']
})
export class CallUsagePercentChartComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() propertyId;
  @Input() structure;
  @Input() tag;

  @Input() resolution;
  @Input() startDate;
  @Input() endDate;
  @Output() goDeeperEventEmitter = new EventEmitter<any>();

  data = [];
  options;


  constructor(
    private translateService: TranslateService,
    private eventService: EventService,
    private structureService: StructureService,
    dateService: DateService) {

    super(dateService);
    this.translateService.onLangChange.subscribe((event) => {
      this.reloadDataAndChart();
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.propertyId != null && this.structure != null) {
      this.reloadDataAndChart();
    }
  }


  reloadDataAndChart() {
    this.reloadChartOptions();
    this.getData();
  }


  getData() {
    const tag = this.tag != null ? this.tag : this.propertyId;
    this.eventService.getReportByTag(this.propertyId, tag, this.resolution.toUpperCase(), EVENT_TAG.CALL_EVENT, null, this.startDate, this.endDate,
      null, null,{ 'source': 'ENUM', 'subject': 'ENUM' }, true).subscribe((res) => {

        this.data = [];
        this.reloadChartOptions();
        this.buildLocationData(res);
      })

  }

  buildLocationData(reports: Array<any>) {

    // now lets build 'all' average
    let allDataValues = [];
    reports = reports.reverse();
    let lastXAxisNumber = null;
    reports.forEach((report) => {
      let timestamp = new Date(report.date);
      report['timestamp'] = timestamp;
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      if(lastXAxisNumber != null){
        while(xAxisNumber - lastXAxisNumber > 1){
          lastXAxisNumber++;
          allDataValues.push({x: lastXAxisNumber, y: 0});
        }
      }
      
      let sourceKeys = Object.keys(report['source']);
      let subjectKeys = Object.keys( report['subject']);;

      let unitsSet = new Set();

      sourceKeys.forEach( (element: string) => {
        if(element.includes(this.propertyId + ".")) {
          unitsSet.add(element)
        }
      });
      subjectKeys.forEach( (element: string) => {
        if(element.includes(this.propertyId + ".")) {
          unitsSet.add(element)
        }
      });

      const count = unitsSet.size;
  

      const tag = this.tag != null ? this.tag : this.propertyId;
      const structure = this.structureService.getStructureByGivenStructureId(this.structure,tag);
      let structures = this.structureService.getAllStructIdsByGivenStructureAndLevel(structure,0);

      let percent = Math.round(100 * (count /structures.size));

      allDataValues.push({ x: xAxisNumber, y: percent, info: report });

      lastXAxisNumber = xAxisNumber;
    });

    this.data.push({
      values: allDataValues,
      key: 'Rooms',
      strokeWidth: 4,
      color: 'rgba(190, 187, 220, 0.5)',
      area: true
    });
  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 300,
        margin: {
          top: 50,
          right: 20,
          bottom: 60,
          left: 45
        },
        clipEdge: true,
        duration: 500,
        tooltips: true,
        stacked: false,
        showControls: false,
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        yDomain: [0, 100],
        yAxis: {
          axisLabel: 'Percent',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d;
          }
        },
        tooltip: {
          contentGenerator: function (e) {
            var series = e.series[0];
            if (series.value === null) return;
            let toolTip = `
            <table>
            <thead>
                <tr>
                    <td colspan="3"><strong class="x-value">` + e.value + `</strong></td>
                </tr>
            </thead>
                <tbody>
                    <tr>
                        <td class="legend-color-guide">
                            <div style="background-color:` + series.color + `"></div>
                        </td>
                        <td class="key">` + series.key + `</td>
                        <td class="value">` + series.value + "%" + `</td>
                    </tr>
                </tbody>
            </table>
            `;

            return toolTip;
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
    this.goDeeperEventEmitter.emit(info);
  }

}
