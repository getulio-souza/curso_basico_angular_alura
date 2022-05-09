import { map, timestamp } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SurveyService, Question, Response, SurveyResponse } from '@alis/survey-ng';

@Component({
  selector: 'survey-response-detail',
  templateUrl: './survey-response-detail.component.html',
  styleUrls: ['./survey-response-detail.component.scss']
})
export class SurveyResponseDetailComponent implements OnInit {

  @Input() surveyResponse;
  @Input() questionsMap;

  contactName;
  location;
  surveyDate;

  cards = [];

  ngOnInit(){

    let extraData = this.surveyResponse.extraData;
    const author = extraData.author;
    
    
    this.contactName = author.contactName;
    this.location = author.location;
    this.surveyDate = extraData.timestamp;

    this.buildCards();
  }

  buildCards(){
    this.questionsMap.forEach( (value,key, map) => {
        const questionLabel = value.name;
        const answer = this.surveyResponse[key];

        let responseType = 'text';
  
        if(value.responseType.display == 'stars'){
          responseType = 'stars';
        } else if(value.responseType.type == 'boolean'){
          responseType = 'boolean';
        }
        this.cards.push({
          questionLabel: questionLabel,
          answer: answer,
          responseType: responseType
        })

    });

  }

}
