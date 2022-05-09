import { map } from 'rxjs/operators';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SurveyService } from '@alis/survey-ng';

import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';
import { DateService } from '../../../../services/date/date.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-survey-satisfaction',
  templateUrl: './survey-satisfaction.component.html',
  styleUrls: ['./survey-satisfaction.component.scss']
})
export class SurveySatisfactionComponent extends AbstractThirtyDays implements OnInit, OnChanges {

  @Input() surveyConfig;
  @Input() startDate: Date;
  @Input() endDate: Date;


  // which means our goal is 70% equal or above 4 */
  private static DEFAULT_RATING_MINIMUM_SATISFACTION_VALUE = 4;
  private static DEFAULT_RATING_GOAL_PERCENTAGE = 70;

  // contains all questions labels available
  availableQuestionLabels: Array<string> = [];

  //contains all questions summary available
  availableQuestionsSummary: Array<any> = [];

  // contains questions that has been selected
  selectedQuestionsLabels: Array<string> = [];

  //contain chartData for each question
  questionsChartData: Array<any> = [];



  allChartData: Object;
  xAxisMap = new Set();

  data = [];
  options;
  resolution = "month";

  questionsGoalMap = new Map<string, number>();

  constructor(
    private translateService: TranslateService,
    private surveyService: SurveyService,

    dateService: DateService) {

    super(dateService);

    this.translateService.onLangChange.subscribe((event) => {
      this.getData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.surveyConfig) {
      if (this.surveyConfig.surveyRef != null && this.startDate != null && this.endDate != null) {

          this.availableQuestionLabels = [];
          this.availableQuestionsSummary =  [];
          this.selectedQuestionsLabels = [];
          this.questionsChartData =  [];
          this.xAxisMap.clear();

        this.buildGoalMap(this.surveyConfig.satisfactionGoalConfig)
        this.reloadDataAndChart();
      }
    }

  }

  buildGoalMap(satisfactionGoalConfig) {
    this.questionsGoalMap = new Map();

    for (var questionId in satisfactionGoalConfig) {
      if (satisfactionGoalConfig.hasOwnProperty(questionId)) {
        this.questionsGoalMap.set(questionId, satisfactionGoalConfig[questionId])
      }
    }

  }
  ngOnInit() {
  }

  reloadDataAndChart() {
    this.getData();
  }


  getData() {
    this.getRequests().subscribe((res: Array<any>) => {

      // posisition 0 is 'questionData'
      // posisition 1 is 'allData'

      this.data = [];
      this.questionsChartData = [];

      // questions chart
      this.buildQuestionsChartData(res[0]);
      this.buildChartWithSelectedLabels();

      //all data chart
      this.buildAllChartData(res[1]);
      this.buildGoalChart('All');

      // reload
      this.reloadChartOptions();
    });
  }

  buildChartWithSelectedLabels() {
    this.data = [];
    this.selectedQuestionsLabels.forEach((selectedQuestionLabel) => {
      var index = this.availableQuestionLabels.indexOf(selectedQuestionLabel);
      if (index > -1) {
        this.data.push(this.questionsChartData[index]);
      }
    });
  }
  getRequests() {
    return forkJoin([
      this.surveyService.getRatingStatsByQuestion(this.surveyConfig.surveyRef, this.startDate.getTime(), this.endDate.getTime(),this.dateService.getTimezone()),
      this.surveyService.getRatingStatsAll(this.surveyConfig.surveyRef, this.startDate.getTime(), this.endDate.getTime(), this.dateService.getTimezone())
    ])
  }


  buildGoalChart(questionLabel) {

    // based on questionLabel, lets find questionSummary
    // if we find a config we should use it
    // else, we should use default value
    let ratingGoalPercent = SurveySatisfactionComponent.DEFAULT_RATING_GOAL_PERCENTAGE;

    if (questionLabel == 'All') {
      // 'all' case
      let config = this.questionsGoalMap.get('all');
      if (config != null) {
        if (config['percentGoal'] != null) {
          ratingGoalPercent = config['percentGoal'];
        }
      }
    }
    else {
      // questions case
      // lets try to find in availableQuestionLabels
      // availableQuestionLabels and availableQuestionsSummary works together
      // cause they hold same question information in same index position
      var index = this.availableQuestionLabels.indexOf(questionLabel);
      if (index > -1) {
        let questionSummary = this.availableQuestionsSummary[index];
        if (questionSummary != null) {
          let questionId = questionSummary.id;
          let config = this.questionsGoalMap.get(questionId);
          if (config != null) {
            if (config['percentGoal'] != null) {
              ratingGoalPercent = config['percentGoal'];
            }
          }
        }
      }
    }


    let goalData = {};

    let values = [];
    this.xAxisMap.forEach((value) => {
      values.push({ x: value, y: ratingGoalPercent });
    });

    goalData['key'] = this.translateService.instant('Goal');
    goalData['values'] = values;
    goalData['color'] = 'rgba(119, 191, 101, 0.87)';
    goalData['type'] = 'line';
    goalData['strokeWidth'] = 4;
    goalData['yAxis'] = 1;

    this.data.push(goalData);
  }

  buildQuestionsChartData(buckets: Array<any>) {
    let questionsAvg = new Array<Array<any>>();
    let questionsLabels = new Array<string>();
    let questionsSummaries = new Array<string>();


    this.questionsChartData = [];
    this.availableQuestionsSummary = [];
    this.availableQuestionLabels = [];


    buckets.forEach(bucket => {
      let timestamp = new Date(bucket.timestamp);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      if (bucket['ratingQuestionsData'] == null || bucket['ratingQuestionsData'].length == 0) { return; }

      var i = 0;
      bucket['ratingQuestionsData'].forEach(summaryData => {
        if (summaryData.questionSummary == null) {
          // ignore data if question summary is not known/specified
          return;
        }
        let questionDataValues = questionsAvg[i];
        if (questionDataValues == null) {
          // first time, lets fill 
          // questionsLabels and questionsSummaries arrays
          questionDataValues = new Array();
          questionsLabels[i] = summaryData.questionSummary.title;
          questionsSummaries[i] = summaryData.questionSummary;
        }

        if (summaryData.ratingArray != null) {
          const percentSatisfaction = this.getPercentSatisfaction(summaryData.ratingArray, summaryData.questionSummary);
          if (percentSatisfaction != null && !isNaN(percentSatisfaction)) {
            questionDataValues.push({ x: xAxisNumber, y: Math.round(10 * percentSatisfaction) / 10 });
          }
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

      this.availableQuestionLabels.push(questionsLabels[index]);
      this.availableQuestionsSummary.push(questionsSummaries[index]);

      let questionChartData = {};
      questionChartData['key'] = this.translateService.instant(questionsLabels[index]);
      questionChartData['values'] = values;
      questionChartData['type'] = 'bar';
      questionChartData['yAxis'] = 1;
      questionChartData['color'] = '#1782ccfc';;
      

      this.data.push(questionChartData);
      this.questionsChartData.push(questionChartData);

    });
  }


  buildAllChartData(buckets: Array<any>) {

    const values = [];

    buckets.forEach(bucket => {
      let timestamp = new Date(bucket.timestamp);
      let xAxis = this.getXAxis(new Date(timestamp));
      let xAxisNumber = Number(xAxis);

      let reportRatingData = bucket['reportRatingData'];
      if (reportRatingData == null) { return; }

      let ratingArray: Array<number> = reportRatingData['ratingArray'];

      if (ratingArray != null) {
        const percentGoal = this.getPercentSatisfaction(ratingArray, null);
        this.xAxisMap.add(xAxisNumber);
        values.push({ x: xAxisNumber, y: Math.round(10 * percentGoal) / 10 })
      }

    });

    // start with 'all'
    this.availableQuestionLabels.push("All");
    this.selectedQuestionsLabels.push("All");

    this.allChartData = {};
    this.allChartData['key'] = this.translateService.instant('All');
    this.allChartData['values'] = values;
    this.allChartData['type'] = 'bar';
    this.allChartData['yAxis'] = 1;
    this.allChartData['color'] = '#1782ccfc';
    this.data.push(this.allChartData);
    this.questionsChartData.push(this.allChartData);

  }


  getPercentSatisfaction(ratingArray: Array<number>, questionSummary) {
    let total = 0;
    let goalCount = 0;
    let i = 0;

    let goalValue = SurveySatisfactionComponent.DEFAULT_RATING_MINIMUM_SATISFACTION_VALUE;

    if (questionSummary != null) {
      let questionConfig = this.questionsGoalMap.get(questionSummary.id);
      if (questionConfig != null) {
        let minimumValue = questionConfig['minimumValue'];
        if (minimumValue != null) {
          goalValue = minimumValue;
        }
      }
    }

    ratingArray.forEach((ratingCount) => {
      //position 0 means rating 1
      //position 4 means rating 5
      let ratingValue = i + 1;
      if (ratingValue >= goalValue) {
        goalCount += ratingCount;
      }

      total += ratingCount;

      i++;
    });

    const percentGoal = 100 * (goalCount / total);
    return percentGoal;
  }

  onQuestionLabelClick(questionLabel) {
    // var index = this.selectedQuestionsLabels.indexOf(questionLabel);
    // if (index > -1) {
    //   // the questionLabel is already there
    //   if(this.selectedQuestionsLabels.length == 1) {
    //     // do not remove if its the last one
    //     return ;
    //   }
    //   this.selectedQuestionsLabels.splice(index, 1);
    // } else {
    //   this.selectedQuestionsLabels.push(questionLabel);
    // }

    // lets keep array structure in case we want to modify
    // and show more than 1 question
    this.selectedQuestionsLabels = [];
    this.selectedQuestionsLabels.push(questionLabel);

    this.buildChartWithSelectedLabels();
    this.buildGoalChart(questionLabel);

  }
  reloadChartOptions() {
    const that = this;
    this.options = {
      chart: {
        type: 'multiChart',
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
          tickFormat: function (d) { let xAxisLabel = that.getXAxisLabel(d); return that.translateService.instant(xAxisLabel); }
        },
        yAxis: {
          axisLabel: that.translateService.instant("Conversion rate"),
          showMaxMin: false,
          tickFormat: function (d) {
            return d + '%';
          }
        },
        interpolate: 'cardinal',
        showLegend: false,
        yDomain1: [0, 100],
        clipEdge: true,
        duration: 500,
        stacked: true,
        showControls: false
      }
    }
  }


}
