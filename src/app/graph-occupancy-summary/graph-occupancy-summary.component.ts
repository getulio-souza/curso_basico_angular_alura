import { TranslateService } from '@ngx-translate/core';
import { DateService } from './../services/date/date.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AbstractThirtyDays } from './../abstracts/abstractThirtyDays';
import { DataService } from './../services/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-graph-occupancy-summary',
  templateUrl: './graph-occupancy-summary.component.html',
  styleUrls: ['./graph-occupancy-summary.component.css']
})
export class GraphOccupancySummaryComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() energyGroupId;
  @Input() occupancyAndConsumeList;

  constructor(private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    public dateService: DateService,
    private route: Router,
    private tkoChartBuilder: TkoChartBuilderService,
    private translateService: TranslateService) {
    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });

  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getData();
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
          axisLabel: that.translateService.instant('Day'),
          showMaxMin: true,
          tickFormat: function (d) {
            return d3.format(',f')(d);
          }
        },
        yAxis: {
          axisLabel: '%',
          axisLabelDistance: -15,
          showMaxMin: false,
          tickFormat: function (d) {
            return Math.round(d) + "%";
          }
        },
        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e);
          });
        },
      }
    };
  }

  onChartClick(elementClicked) {
    this.route.navigate(["occupancyDetails/" + this.energyGroupId], { relativeTo: this.activatedRoute.parent });
  }

  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.translateService.get(['Occupancy', 'Sold']).subscribe((translations) => {
      // translation loader is now ready
      this.data = this.tkoChartBuilder.buildOccupancyData(this.occupancyAndConsumeList, translations, 'day', null,this);
    });
  }


}
