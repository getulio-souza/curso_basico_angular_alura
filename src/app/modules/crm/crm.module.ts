import { SurveyConversionRateComponent } from './components/survey-conversion-rate/survey-conversion-rate.component';
import { SurveySatisfactionComponent } from './components/survey-satisfaction/survey-satisfaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRMPageComponent } from './components/crmPage/crmPage.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProxperCommonModule } from '../proxperCommon/proxperCommon.module';
import { SurveyAverageComponent } from './components/survey-average/survey-average.component';
import { SurveyGridComponent } from './components/survey-grid/survey-grid.component';
import { SurveyResponseDetailComponent } from './components/survey-response-detail/survey-response-detail.component';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
    ]),
    ProxperCommonModule
  ],
  declarations: [
    CRMPageComponent,
    SurveyAverageComponent,
    SurveySatisfactionComponent,
    SurveyGridComponent,
    SurveyResponseDetailComponent,
    SurveyConversionRateComponent
  ],
  exports: [
  ]
})
export class CRMModule { }
