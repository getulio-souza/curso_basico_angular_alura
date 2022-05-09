import { map, timestamp } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SurveyService, Question, Response, SurveyResponse } from '@alis/survey-ng';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-survey-grid',
  templateUrl: './survey-grid.component.html',
  styleUrls: ['./survey-grid.component.scss']
})
export class SurveyGridComponent implements OnChanges {

  @Input() surveyConfig;
  @Input() startDate: Date;
  @Input() endDate: Date;

  panelHeightInitial;

  questionIds = [];

  gridData = [];
  gridDataFiltered = [];
  gridColumns = [];
  multiSortMeta = [{field: 'timestamp', order:-1}]
  
  panelOpen = false;
  isReady = false;

  showDetailResponse = false;


  selectedResponse;
  allQuestionsMap = new Map();


  keyword = '';


  constructor(private surveyService: SurveyService, private datePipe: DatePipe) {
    this.panelHeightInitial = '70px';
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.surveyConfig != null){
      if (this.surveyConfig.surveyRef != null && this.startDate != null && this.endDate != null) {
        this.buildGridData(this.surveyConfig.surveyRef);
      }
    }    
  }

  filterTraces() {
    if (this.keyword !== '') {
      this.gridDataFiltered = this.gridData.filter(this.traceHasKeyword.bind(this));
    }else{
      this.gridDataFiltered = this.gridData.slice();
    }
  }


  private traceHasKeyword(data) {
    if(this.keyword.trim().length == 0) return true;

    const dateAsStr = data.timestamp ? this.datePipe.transform(data.timestamp, 'short').toString().indexOf(this.keyword.toUpperCase()) > -1 : false;
    const customer = data.customer ? data.customer.toUpperCase().indexOf(this.keyword.toUpperCase()) > -1 : false;
    const location = data.location ? data.location.toUpperCase().indexOf(this.keyword.toUpperCase()) > -1 : false;
    const average = data.average ? data.average.toString().toUpperCase().indexOf(this.keyword.toUpperCase()) > -1 : false;


    return dateAsStr || customer || location || average;

  }

  buildGridData(surveyId) {

    //TODO - USE ID FROM CONFIG
    this.surveyService.getSurveyResponsesBySurveyId(surveyId,this.startDate.getTime(),this.endDate.getTime()).subscribe((surveyResponses: Array<SurveyResponse>) => {

      this.gridData = [];
      //to build gridColumns we just need one surveyReponse (we'll use the last one which should be more recent)
      if (surveyResponses && surveyResponses.length > 0) {
        this.buildGridColumns(surveyResponses[surveyResponses.length-1]);
      }

      surveyResponses.forEach((surveyResponse) => {
        this.processResponse(surveyResponse);
      });

      this.gridDataFiltered = this.gridData;

      this.isReady = true;
    });
  }

  processResponse(surveyResponse: SurveyResponse) {
    let total = 0;
    let count = 0;
    let responsesMap = {};

    if (surveyResponse.responses == null) { return; }

    surveyResponse.responses.forEach(surveyResponse => {
      responsesMap = this.buildResponsesMap(surveyResponse, responsesMap);
    });

    for (var key in responsesMap) {
      if (Object.prototype.hasOwnProperty.call(responsesMap, key)) {
        let value = responsesMap[key];
        //build average
        if (Number.isInteger(value)) {
          total += value;
          count++;
        }
      }
    }

    responsesMap['customer'] = surveyResponse.author.contactName;
    responsesMap['location'] = surveyResponse.author.location;
    responsesMap['timestamp'] = surveyResponse.timestamp;
    let average = total / count;
    let averageLabel = isNaN(average) ? "--" : Math.round(average * 10) / 10;
    responsesMap['average'] = averageLabel;
    responsesMap['extraData'] = surveyResponse;

   
    this.gridData.push(responsesMap);

  }

  buildGridColumns(response) {
    let sections = response.surveyContent.sections;
    let questionsMap = new Map();
    this.allQuestionsMap = new Map();
    sections.forEach((section) => {
      let questions = section.questions;
      questions.forEach(question => {
        questionsMap = this.buildQuestionsMap(question, questionsMap);
      });
    });

    this.gridColumns = [
      { field: 'customer', header: 'Customer' },
      { field: 'location', header: 'Unit' }
    ];

    //all questions
    questionsMap.forEach((question: Question, key, map) => {
      if ((question.responseType.type == 'integer' && question.responseType['display'] == 'stars') ||
        (question.responseType.type == 'boolean')) {
        // do not incluse any questions
        // this.gridColumns.push({ field: question.id, header: question.name });
      }



      this.allQuestionsMap.set(question.id,question);
      this.questionIds.push(key);
    });

    this.gridColumns.push({ field: 'average', header: 'Average' }, { field: 'timestamp', header: 'Date' })
  }



  buildResponsesMap(response: Response, map) {
    map[response.ref] = response.value;

    if (response.responses != null && response.responses.length != 0) {
      response.responses.forEach(childResponse => {
        map = this.buildResponsesMap(childResponse, map);
      });
    }
    return map
  }

  buildQuestionsMap(question: Question, map: Map<String, Question>) {
    map.set(question.id, question);
    if (question.questions != null && question.questions.length != 0) {
      question.questions.forEach(question => {
        map = this.buildQuestionsMap(question, map)
      });
    }
    return map;
  }

  onGridItemClick(event) {
    this.selectedResponse = event;
    this.showDetailResponse = true;
  }


  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }

}
