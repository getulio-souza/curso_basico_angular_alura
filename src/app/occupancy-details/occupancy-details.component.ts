import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data/data.service';
import { DateService } from './../services/date/date.service';
import { Presence } from '@alis/proxper-base';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractThirtyDays } from './../abstracts/abstractThirtyDays';
import { TkoChartBuilderService } from '../services/tkoChartBuilder/tko-chart-builder.service';

@Component({
  selector: 'app-occupancy-details',
  templateUrl: './occupancy-details.component.html',
  styleUrls: ['./occupancy-details.component.css']
})
export class OccupancyDetailsComponent extends AbstractThirtyDays implements OnInit {

  energyGroupId;

  // chart configs
  options;
  data;


  constructor(private activatedRoute: ActivatedRoute,
    public dateService: DateService,
    private dataService: DataService,
    private router: Router,
    private translateService: TranslateService,
    private tkoChartBuilder: TkoChartBuilderService) {
    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });

  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe(params => {
        this.energyGroupId = params.get('energyGroupId');
        this.getData();
      });
  }


  back() {
    this.router.navigate(['engineering'], { relativeTo: this.activatedRoute.parent });
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 500,
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
        yAxis: {
          axisLabel: '%',
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return Math.round(d) + "%";
          }
        },

        callback: function (chart) {
          chart.multibar.dispatch.on('elementClick', function (e) {
            that.onChartClick(e.data.presenceInfo);
          });
        }
      }
    };
  }

  onChartClick(presenceInfo: Presence) {
    this.goDeeper(presenceInfo);
  }



  getData() {
    this.data = new Array();
    this.reloadChartOptions();
    this.dataService.getOccupancyAndConsumptionList(this.energyGroupId,
      this.energyGroupId, 
      this.resolution,
      this.startDate,
      this.endDate,
      null,
      null,
    )
      .subscribe((presenceList: Presence[]) => {
        this.translateService.get(['Occupancy', 'Sold']).subscribe((translations) => {
          // translation loader is now ready
          this.data = this.tkoChartBuilder.buildOccupancyData(presenceList, translations, this.resolution, null, this);
        });
      });
  }

}
