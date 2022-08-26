import { OrderProductivityComponent } from "./components/order-productivity/order-productivity.component";
import { OrderTableComponent } from "./components/order-productivity/order-table/order-table.component";
import { OrderGraphicsViewComponent } from "./components/order-productivity/order-graphics-view/order-graphics-view.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ProxperCommonModule } from "../proxperCommon/proxperCommon.module";
import { AvgElapsedTimeByCategoryComponent } from "./avg-elapsed-time-by-category/avg-elapsed-time-by-category.component";
import { AvgElapsedTimeByPractitionerComponent } from "./avg-elapsed-time-by-practitioner/avg-elapsed-time-by-practitioner.component";
import { OrderPageComponent } from "./components/order-page/order-page.component";
import { OrderSummaryComponent } from "./components/order-summary/order-summary.component";
import { OrderQtyChartByDaysComponent } from "./order-qty-chart-by-days/order-qty-chart-by-days.component";
import { OrderQtyChartComponent } from "./order-qty-chart/order-qty-chart.component";
import { OrderQtyDelayed } from "./order-qty-delayed/order-qty-delayed";
import { Top4MostDemandByCategoryChart } from "./top4-most-demand-by-category-chart/top4-most-demand-by-category-chart.component";
import { OrderBySectorsChartComponent } from "./order-by-sectors-chart/order-by-sectors-chart.component";
import { DynamicWidgetModule } from "../dynamic-widgets/dynamic-widgets.module";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([]),
    ProxperCommonModule,
    DynamicWidgetModule,
  ],
  declarations: [
    OrderSummaryComponent,
    OrderPageComponent,
    OrderProductivityComponent,
    OrderQtyChartComponent,
    OrderBySectorsChartComponent,
    OrderQtyDelayed,
    Top4MostDemandByCategoryChart,
    AvgElapsedTimeByCategoryComponent,
    AvgElapsedTimeByPractitionerComponent,
    OrderQtyChartByDaysComponent,
    OrderGraphicsViewComponent,
    OrderTableComponent,
  ],
})
export class OrderModule {}
