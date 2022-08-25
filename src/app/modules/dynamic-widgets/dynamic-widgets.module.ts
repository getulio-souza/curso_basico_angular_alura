import { ChartsObservable } from "./charts/charts.observable";
import { CollapseGridComponent } from "./collapse-grid/collapse-grid.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProxperCommonModule } from "../proxperCommon/proxperCommon.module";
import { ChartsComponent } from "./charts/charts.component";
import { ChartBarVerticalComponent } from "./charts/components/chart-bar-vertical/chart-bar-vertical.component";
import { ChartPizzaComponent } from "./charts/components/chart-pizza/chart-pizza.component";
import { ChartBarHorizontalComponent } from "./charts/components/chart-bar-horizontal/chart-bar-horizontal.component";
import { ChartLinesComponent } from "./charts/components/chart-lines/chart-lines.component";
import { ChartFunnelComponent } from "./charts/components/chart-funnel/chart-funnel.component";
import { ChartGaugeComponent } from "./charts/components/chart-gauge/chart-gauge.component";
import { ChartStackedLineComponent } from "./charts/components/chart-stacked-line/chart-stacked-line.component";
import { ChartBarVerticalSimpleComponent } from "./charts/components/chart-bar-vertical-simple/chart-bar-vertical-simple.component";
import { ChartBarVerticalNpsComponent } from "./charts/components/chart-bar-vertical-nps/chart-bar-vertical-nps.component";
import { ChartLinesNpsComponent } from "./charts/components/chart-lines-nps/chart-lines-nps.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "@alis/customer-base";
import { HttpClient } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    ProxperCommonModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    ChartsComponent,
    ChartBarVerticalComponent,
    ChartBarHorizontalComponent,
    ChartPizzaComponent,
    ChartLinesComponent,
    ChartFunnelComponent,
    ChartGaugeComponent,
    ChartStackedLineComponent,
    ChartBarVerticalSimpleComponent,
    CollapseGridComponent,
    ChartBarVerticalNpsComponent,
    ChartLinesNpsComponent,
  ],
  providers: [ChartsObservable],
  exports: [
    ChartsComponent,
    ChartBarVerticalComponent,
    ChartBarHorizontalComponent,
    ChartPizzaComponent,
    ChartLinesComponent,
    ChartFunnelComponent,
    ChartGaugeComponent,
    ChartStackedLineComponent,
    ChartBarVerticalSimpleComponent,
    CollapseGridComponent,
    ChartBarVerticalNpsComponent,
    ChartLinesNpsComponent,
  ],
})
export class DynamicWidgetModule {}
