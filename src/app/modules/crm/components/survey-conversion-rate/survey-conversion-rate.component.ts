import { FakeDataService } from './../../../../services/fake-data/fake-data.service';
import { EventService, EVENT_TYPE } from './../../../../services/event/event.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SurveyService } from '@alis/survey-ng';
import { PropertiesService } from '@alis/ng-services';
import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-survey-conversion-rate',
  templateUrl: './survey-conversion-rate.component.html',
  styleUrls: ['./survey-conversion-rate.component.scss']
})
export class SurveyConversionRateComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() surveyConfig;
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() propertyId;

  data = [];
  options;

  resolution = "month";

  surveyResponsesMap = new Map();

  constructor(
    private translateService: TranslateService,
    private surveyService: SurveyService,
    private eventService: EventService,
    private propertiesService: PropertiesService,
    private fakeDataService: FakeDataService,

    dateService: DateService) {

    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (this.surveyConfig != null) {
      if (this.surveyConfig.surveyRef != null && this.startDate != null && this.endDate != null) {
        this.reloadDataAndChart();
      }
    }
  }
  reloadDataAndChart() {
    this.getData();
  }


  getData() {
    this.getRequests().subscribe((res: Array<any>) => {
      this.data = [];
      this.buildByLocation(res[0]);
      this.buildSoldEvents(res[1]);

      this.reloadChartOptions();


    })
  }

  buildByLocation(locationBuckets: Array<any>) {

    this.surveyResponsesMap = new Map();
    locationBuckets.forEach((locationBucket) => {
      let timestamp = new Date(locationBucket.timestamp);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      if (locationBucket['responsesByLocation'] == null || Object.keys(locationBucket['responsesByLocation']).length == 0) { return; };

      let responsesByLocation = locationBucket['responsesByLocation'];
      if (responsesByLocation != null) {
        let count = 0;
        for (var prop in responsesByLocation) {
          if (Object.prototype.hasOwnProperty.call(responsesByLocation, prop)) {
            count += responsesByLocation[prop];
          }
        }

        if (count != null) {
          this.surveyResponsesMap.set(xAxisNumber, count.toFixed());
        }
      }


    });

  }

  buildSoldEvents(soldEventsReport) {
    let values = [];

    soldEventsReport.forEach((soldEvent) => {
      let date = new Date(soldEvent.date);
      let xAxis = this.getXAxis(date);
      let xAxisNumber = Number(xAxis);

      let value = soldEvent['state'];

      if(value != null){
        const totalSoldEvents = value['sold'];
        if(totalSoldEvents != null && totalSoldEvents != 0){
          const responsesCount = this.surveyResponsesMap.get(xAxisNumber);
          let conversionRate = 100 * (responsesCount / totalSoldEvents);
          conversionRate = Math.round(conversionRate * 10) / 10;
          values.push({ x: xAxisNumber, y: conversionRate });
        }
      }
    });

    
    this.data.push({
      values: values,
      key: this.translateService.instant('Conversion rate'),
      strokeWidth: 4,
      color: 'rgba(119, 191, 101, 0.87)'
    });


  }

  getRequests() {
    //  const byLocation = this.surveyService


    const timezone = this.dateService.getTimezone();
    const locations = this.surveyService.getReportLocation(this.surveyConfig.surveyRef, this.startDate.getTime(), this.endDate.getTime(), timezone);

    const body = {
      "value": "ENUM"
    }

    // const soldEvent = this.eventService.getReportByTag(
    //   this.propertyId,this.propertyId,
    //   this.resolution.toUpperCase(),
    //   EVENT_TYPE.PMS_CHANGE,EVENT_TYPE.PMS_AVAILABILITY,
    //   this.startDate.getTime(),this.endDate.getTime(),
    //   null,null,body);

    // FAKE DATA
    const sold = of(this.fakeDataService.getPmsReport(this.startDate.getTime(),this.endDate.getTime()));

    
    return forkJoin([locations, sold])
  }

  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiBarChart',
        height: 390,
        margin: {
          top: 80,
          right: 50,
          left: 120
        },
        legend: {
          margin: {
            bottom: 30,
            right: 30,
            left: 30
          },
          align: false
        },
        xAxis: {
          axisLabel: that.translateService.instant(this.getAxisLabel()),
          showMaxMin: true,
          tickFormat: function (d) { return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        interpolate: 'cardinal',
        showLegend: true,
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false
      }
    }
  }


}
