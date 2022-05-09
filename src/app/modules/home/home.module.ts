import { RatingPieChartComponent } from './components/rating-pie-chart/rating-pie-chart.component';
import { HomePage2Component } from './components/homePage2/homePage2.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProxperCommonModule } from '../proxperCommon/proxperCommon.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RatingCardComponent } from './components/rating-card/rating-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
    ]),
    ProxperCommonModule,
    PerfectScrollbarModule
  ],
  declarations: [
    HomePage2Component,
    RatingPieChartComponent,
    RatingCardComponent
  ],
  exports: [
  ]
})
export class HomeModule { }
