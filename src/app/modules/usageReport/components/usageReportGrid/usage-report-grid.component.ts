import { Component,  Input, OnChanges, SimpleChanges } from '@angular/core';
import { SurveyService, Question, Response, SurveyResponse } from '@alis/survey-ng';

@Component({
  selector: 'app-usage-report-grid',
  templateUrl: './usage-report-grid.component.html',
  styleUrls: ['./usage-report-grid.component.scss']
})
export class UsageReportGrid implements OnChanges {

  @Input() surveyConfig;

  panelHeightInitial;

  questionIds = [];

  gridData = [];
  gridColumns = [];
  
  panelOpen = false;
  isReady = false;

  constructor(private surveyService: SurveyService) {
    this.panelHeightInitial = '70px';
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.surveyConfig != null){
      if (this.surveyConfig.surveyRef != null) {
        this.buildGridData(this.surveyConfig.surveyRef);
      }
    }    
  }

  buildGridData(surveyId) {

    //TODO - USE ID FROM CONFIG
    this.surveyService.getSurveyResponsesBySurveyId(surveyId).subscribe((surveyResponses: Array<SurveyResponse>) => {

      //to build gridColumns we just need one surveyReponse
      this.buildGridColumns(surveyResponses[0]);

      surveyResponses.forEach((surveyResponse) => {
        this.processResponse(surveyResponse);
      });

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

    responsesMap['customer'] = surveyResponse.author.location + " (" + surveyResponse.author.contactName + ")";
    responsesMap['timestamp'] = surveyResponse.timestamp;
    let average = total / count;
    responsesMap['average'] = Math.round(average * 10) / 10;

    this.gridData.push(responsesMap);

  }

  buildGridColumns(response) {
    let sections = response.surveyContent.sections;
    let questionsMap = new Map();
    sections.forEach((section) => {
      let questions = section.questions;
      questions.forEach(question => {
        questionsMap = this.buildQuestionsMap(question, questionsMap);
      });
    });

    this.gridColumns = [{ field: 'customer', header: 'Customer' }];
    questionsMap.forEach((question: Question, key, map) => {
      if ((question.responseType.type == 'integer' && question.responseType['display'] == 'stars') ||
        (question.responseType.type == 'boolean')) {

        this.gridColumns.push({ field: question.id, header: question.name });
      }
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
    console.log("grid item has been clicked");
    console.log(event);
  }


  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }

}
