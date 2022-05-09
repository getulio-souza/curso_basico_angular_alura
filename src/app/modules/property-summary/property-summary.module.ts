import { PropertyMapComponent } from './components/property-map/property-map.component';
import { BMSComponent } from './components/bms/bms.component';
import { FloorDetailsGridComponent } from './components/floor-details-grid/floor-details-grid.component';

import { PropertySummaryPageComponent2 } from './components/property-summary-page-2/property-summary-page-2.component';
import { PropertySummaryCurtainComponent } from './components/property-summary-curtain/property-summary-curtain.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProxperCommonModule } from '../proxperCommon/proxperCommon.module';
import { PropertySummaryComponent2 } from './components/property-summary/property-summary2.component';
import { LevelDetailsComponent } from './components/level-details/level-details.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { GroundPlanGridComponent } from './components/ground-plan/ground-plan-grid.component';
import { FloorPlanSvgComponent } from './components/floor-plan-svg/floor-plan-svg.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
    ]),
    ProxperCommonModule
  ],
  declarations: [
    PropertySummaryPageComponent2,
    PropertySummaryCurtainComponent,
    PropertySummaryPageComponent2,
    PropertySummaryComponent2,
    LevelDetailsComponent,
    FloorDetailsGridComponent,
    RoomDetailComponent,
    GroundPlanGridComponent,
    FloorPlanSvgComponent,
    PropertyMapComponent,
    BMSComponent
  ],
  exports: [
  ]
})
export class PropertySummaryModule { }
