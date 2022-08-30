import { OrderProductivityComponent } from "./../order/components/order-productivity/order-productivity.component";
import { PropertySummaryPageComponent2 } from "./../property-summary/components/property-summary-page-2/property-summary-page-2.component";
import { HomePage2Component } from "./../home/components/homePage2/homePage2.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CallbackComponent } from "./components/callback/callback.component";
import { PropertiesCardComponent } from "./components/properties-card/properties-card.component";
import { SelectPropertyComponent } from "./components/select-property/select-property.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PropertyAppComponent } from "./components/property-app/property-app.component";
import { TranslateModule } from "@ngx-translate/core";
import { HeaderStatusComponent } from "./components/header-status/header-status.component";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../../guards/auth-guard/auth.guard";
import { NoRegisteredGuard } from "../../guards/noRegistered-guard/noRegistered.guard";
import { PropertySummaryPageComponent } from "../../propertySummaryPage/property-summary-page/property-summary-page.component";
import { ConsumeDetailsComponent } from "../../consume-details/consume-details.component";
import { OccupancyDetailsComponent } from "../../occupancy-details/occupancy-details.component";
import { EngineeringPageComponent } from "../../engineering/engineering-page/engineering-page.component";
import { HousekeepingPageComponent } from "../../houseKeeping/housekeepingPage/housekeepingPage.component";
import { OptimizationPageComponent } from "../../optimization/optimizationPage/optimizationPage.component";
import { TelkonetPageComponent } from "../../telkonet/telkonet-page/telkonet-page.component";
import { MaintenancePageComponent } from "../../maintenance/maintenancePage/maintenancePage.component";
import { ITPageComponent } from "../../it/itPage/itPage.component";
import { OccupancyWeekDetailsComponent } from "../../occupancy-week-details/occupancy-week-details.component";
import { ConsumeWeekDetailsComponent } from "../../consume-week-details/consume-week-details.component";
import { NotificationMessagesComponent } from "./components/notification-messages/notification-messages.component";
import { ProxperConfigGuard } from "../../guards/proxperConfig-guard/proxperConfig.guard";
import { NoRegisteredPropertiesComponent } from "./components/no-registered-properties/no-registered-properties.component";
import { CRMPageComponent } from "../crm/components/crmPage/crmPage.component";
import { UsageReportPageComponent } from "../usageReport/components/usageReportPage/usageReportPage.component";
import { OrderPageComponent } from "../order/components/order-page/order-page.component";
import { RoleGuard } from "../../guards/role-guard/role.guard";
import { RoomControlPage } from "../room-control/components/room-control-page/room-control-page.component";
import { NvD3Module } from "ng2-nvd3";
import { NPSPageComponent } from "../nps/components/nps-page/nps-page.component";
import { LoginComponent } from "../../login/login.component";
import { LogoutComponent } from './components/logout/logout.component';
import { LogoutModalComponent } from './components/logout-modal/logout-modal/logout-modal.component';
// import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path:"logout",
        component: LogoutComponent,
      },
      {
        path: "selectProperty",
        component: SelectPropertyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "noRegisteredProperty",
        component: NoRegisteredPropertiesComponent,
        canActivate: [AuthGuard, NoRegisteredGuard],
      },
      {
        path: "propertyApp/:propertyId",
        component: PropertyAppComponent,
        canActivate: [AuthGuard, ProxperConfigGuard],
        children: [
          { path: "", component: HomePage2Component },
          { path: "home", component: HomePage2Component },
          {
            path: "propertySummary",
            component: PropertySummaryPageComponent2,
            canActivate: [RoleGuard],
          },
          {
            path: "propertySummaryold",
            component: PropertySummaryPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "consumeDetails/:energyGroupId",
            component: ConsumeDetailsComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "consumeWeekDetails/:energyGroupId",
            component: ConsumeWeekDetailsComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "occupancyDetails/:energyGroupId",
            component: OccupancyDetailsComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "occupancyWeekDetails/:energyGroupId",
            component: OccupancyWeekDetailsComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "engineering",
            component: EngineeringPageComponent,
            canActivate: [RoleGuard],
          },
          { path: "it", component: ITPageComponent, canActivate: [RoleGuard] },
          {
            path: "maintenance",
            component: MaintenancePageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "housekeeping",
            component: HousekeepingPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "optimization",
            component: OptimizationPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "energyManagement",
            component: TelkonetPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "crm",
            component: CRMPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "usageReport",
            component: UsageReportPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "order",
            component: OrderPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "nps",
            component: NPSPageComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "produtividade",
            component: OrderProductivityComponent,
            canActivate: [RoleGuard],
          },
          {
            path: "roomControl",
            component: RoomControlPage,
            canActivate: [RoleGuard],
          },
        ],
      },
    ]),
    NvD3Module,
  ],
  declarations: [
    CallbackComponent,
    PropertiesCardComponent,
    SelectPropertyComponent,
    SidebarComponent,
    NotFoundComponent,
    PropertyAppComponent,
    HeaderStatusComponent,
    NotificationMessagesComponent,
    NoRegisteredPropertiesComponent,
    LogoutComponent,
    LogoutModalComponent,
  ],
  exports: [],
})
export class StarterPageModule {}
