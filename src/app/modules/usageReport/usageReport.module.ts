import { CallUsagePercentChartComponent } from './components/callUsagePercentChart/call-usage-percent-chart';
import { AutomationUsagePercentChartComponent } from './components/automationUsagePercentChart/automation-usage-percent-chart.component';

import { CallUsageVolumeChartComponent } from './components/callUsageVolumeChart/call-usage-volume-chart.component';
import { AutomationUsageVolumeChartComponent } from './components/automationUsageVolumeChart/automation-usage-volume-chart.component';
import { UsageReportPageComponent } from './components/usageReportPage/usageReportPage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProxperCommonModule } from '../proxperCommon/proxperCommon.module';
import { UsageReportChartsComponent } from './components/usageReportCharts/usageReportCharts.component';
import { UsageReportGrid } from './components/usageReportGrid/usage-report-grid.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
    ]),
    ProxperCommonModule
  ],
  declarations: [
    UsageReportPageComponent,
    AutomationUsagePercentChartComponent,
    AutomationUsageVolumeChartComponent,
    CallUsageVolumeChartComponent,
    CallUsagePercentChartComponent,
    UsageReportChartsComponent,
    UsageReportGrid

  ],
  exports: [
  ]
})
export class UsageReportModule { }
