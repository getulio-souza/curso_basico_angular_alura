import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SurveyService } from '@alis/survey-ng';
import { PropertiesService } from '@alis/ng-services';
import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-survey-average',
  templateUrl: './survey-average.component.html',
  styleUrls: ['./survey-average.component.scss']
})
export class SurveyAverageComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() surveyConfig;
  @Input() startDate: Date;
  @Input() endDate: Date;

  data = [];
  options;

  resolution = "month"

  constructor(
    private translateService: TranslateService,
    private surveyService: SurveyService,
    private propertiesService: PropertiesService,

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

    if(this.surveyConfig != null){
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
      this.buildQuestionsAverageChartData(res[0]);
      this.buildAllAverageChartData(res[1]);
      this.reloadChartOptions();
    })
  }

  buildAllAverageChartData(allBuckets: Array<any>) {

    // now lets build 'all' average
    let allDataValues = [];
    allBuckets.forEach((allBucket) => {
      let timestamp = new Date(allBucket.timestamp);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      let reportSummaryAllData = allBucket['reportSummaryAllData'];
      if (reportSummaryAllData != null) {
        let avg = reportSummaryAllData.avg;
        if (avg != null) {
          avg = Math.round(avg * 100) / 100;
          allDataValues.push({ x: xAxisNumber, y: avg });
        }
      }


    });

    this.data.push({
      values: allDataValues,
      key: 'All',
      strokeWidth: 4,
      color: 'rgba(190, 187, 220, 0.5)',
      area: true
    });
  }
  getRequests() {    
    return forkJoin([
      this.surveyService.getReportSummaryByQuestion(this.surveyConfig.surveyRef, this.startDate.getTime(), this.endDate.getTime(), this.dateService.getTimezone()),
      this.surveyService.getReportSummaryAll(this.surveyConfig.surveyRef, this.startDate.getTime(), this.endDate.getTime(), this.dateService.getTimezone())
    ])
  }

  buildQuestionsAverageChartData(questionBuckets: Array<any>) {

    let questionsAvg = new Array<Array<any>>();
    let questionsLabels = new Array<string>();

    questionBuckets.forEach(bucket => {
      let timestamp = new Date(bucket.timestamp);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      if (bucket['summariesQuestionData'] == null ||bucket['summariesQuestionData'].length == 0) { return; }

      // summary data should always have same size
      // no matter which bucket you are
      // because client always send all responses even if
      // the answer has not been answered
      var i = 0;
      bucket['summariesQuestionData'].forEach(summaryData => {
        if (summaryData.questionSummary == null) {
          // ignore data if question summary is not known/specified
          return;
        }
        let questionDataValues = questionsAvg[i];
        if (questionDataValues == null) {
          questionDataValues = new Array();
          
          if(summaryData.questionSummary == null){ return ;}

          questionsLabels[i] = summaryData.questionSummary.title;
        }

        
        // this component only show average
        // so, only make sense to show integer or real response types
        // lets check it and if avg is not null
        let responseType = summaryData.questionSummary.responseType;

        let avg = summaryData.avg;
        if (avg != null && (responseType.type == 'integer' || responseType.type == 'real')) {
          avg = Math.round(avg * 100) / 100;
          questionDataValues.push({ x: xAxisNumber, y: avg});
        }

        questionsAvg[i] = questionDataValues;
        i++;
      });;
    });

    questionsAvg.forEach((values, index, test) => {
      if (values.length == 0) {
        //no data, do not add;
        return;
      }
      this.data.push({
        values: values,
        key: questionsLabels[index], //key  - the name of the series.
        strokeWidth: 2,
      })
    });


  }


  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'lineChart',
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
          tickFormat: function (d) {  return that.translateService.instant(that.getXAxisLabel(d)); }
        },
        interpolate: 'cardinal',
        showLegend: true,
        yDomain: [0, 6],
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false
      }
    }
  }


}
