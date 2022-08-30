import { OrderProductivityComponent } from "./modules/order/components/order-productivity/order-productivity.component";
import { AuthorizationTokenInterceptor } from "./services/http-interceptor/authorization-token-interceptor";
import { HomeModule } from "./modules/home/home.module";
import { PropertySummaryModule } from "./modules/property-summary/property-summary.module";
import { UsageReportModule } from "./modules/usageReport/usageReport.module";
import { CoolingDemandChartComponent } from "./engineering/cooling-demand-chart/cooling-demand-chart.component";
import { DeviceTypeOfflineChartComponent } from "./it/device-type-offline-chart/device-type-offline-chart.component";

//services
import { MessageService } from "primeng/api";
import { DeviceDataService } from "./services/device-data/device-data.service";
import { FakeDataService } from "./services/fake-data/fake-data.service";
import { DateService } from "./services/date/date.service";
import { ContextService } from "./services/context/context.service";
import { HospitalityWeatherService } from "@alis/hospitality-ng";

// modules
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NvD3Module } from "ng2-nvd3";
import { AutomationNgModule } from "@alis/automation-ng";
import { CustomerBaseModule } from "@alis/customer-base";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

// components
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GraphConsumeSummaryComponent } from "./graph-consume-summary/graph-consume-summary.component";
import { GraphConsumeWeekComponent } from "./graph-consume-week/graph-consume-week.component";
import { GraphOccupancySummaryComponent } from "./graph-occupancy-summary/graph-occupancy-summary.component";
import { GraphOccupancyWeekComponent } from "./graph-occupancy-week/graph-occupancy-week.component";
import { WeekNavigationComponent } from "./week-navigation/week-navigation.component";
import { PowerRealTimeComponent } from "./engineering/power-real-time/power-real-time.component";
import { EnergyConsumptionComponent } from "./energy-consumption/energy-consumption.component";
import { ColdChamberComponent } from "./engineering/cold-chamber/cold-chamber.component";
import { ColdChamberEvolutixComponent } from "./engineering/cold-chamber-evolutix/cold-chamber-evolutix.component";
import { ChillerComponent } from "./engineering/chiller/chiller.component";
import { NewDevicesDemoComponent } from "./new-devices-demo/new-devices-demo.component";
import { HomePageComponent } from "./home/homePage/homePage.component";
import { EnergyInfoComponent } from "./home/energy-info/energy-info.component";
import { RoomDevicesInfoComponent } from "./roomFolder/room-devices-info/room-devices-info.component";
import { RoomDetailsComponent } from "./roomFolder/room-details/room-details.component";
import { PropertyDetailsDevicesComponent } from "./home/property-details-devices/property-details-devices.component";
import { ConsumeInfoChartComponent } from "./home/consume-info-chart/consume-info-chart.component";
import { SoldInfoChartComponent } from "./home/sold-info-chart/sold-info-chart.component";
import { RoomsInfoComponent } from "./home/rooms-info/rooms-info.component";
import { FloorsInfoComponent } from "./home/floors-info/floors-info.component";
import { SoldInfoComponent } from "./home/sold-info/sold-info.component";
import { TemperatureRealTimeComponent } from "./temperature-real-time/temperature-real-time.component";
import { GraphOccupancyRealTimeComponent } from "./graph-occupancy-real-time/graph-occupancy-real-time.component";
import { GraphHvacRealTimeComponent } from "./graph-hvac-real-time/graph-hvac-real-time.component";
import { ConsumeDetailsComponent } from "./consume-details/consume-details.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { OccupancyDetailsComponent } from "./occupancy-details/occupancy-details.component";
import { ConsumeWeekDetailsComponent } from "./consume-week-details/consume-week-details.component";
import { OccupancyWeekDetailsComponent } from "./occupancy-week-details/occupancy-week-details.component";
import { PropertySummaryComponent } from "./home/property-summary/property-summary.component";
import { BlueprintViewUnitComponent } from "./home/blueprint-view-unit/blueprint-view-unit.component";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

import "d3";
import "nvd3";
import { HousekeepingPageComponent } from "./houseKeeping/housekeepingPage/housekeepingPage.component";
import { OptimizationPageComponent } from "./optimization/optimizationPage/optimizationPage.component";
import { ITPageComponent } from "./it/itPage/itPage.component";
import { MaintenancePageComponent } from "./maintenance/maintenancePage/maintenancePage.component";
import { PropertySummaryPageComponent } from "./propertySummaryPage/property-summary-page/property-summary-page.component";
import { EngineeringPageComponent } from "./engineering/engineering-page/engineering-page.component";
import { ThermostatModeChartComponent } from "./engineering/thermostat-mode-chart/thermostat-mode-chart.component";
import { ThermostatFanChartComponent } from "./engineering/thermostat-fan-chart/thermostat-fan-chart.component";
import { ThermostatStateChartComponent } from "./engineering/thermostat-state-chart/thermostat-state-chart.component";
import { ThermostatOccupancyChartComponent } from "./engineering/thermostat-occupancy-chart/thermostat-occupancy-chart.component";
import { SetpointDifferentialChartComponent } from "./engineering/setpoint-differential-chart/setpoint-differential-chart.component";
import { DndStateChartComponent } from "./houseKeeping/dnd-state-chart/dnd-state-chart.component";
import { DndTimeChartComponent } from "./houseKeeping/dnd-time-chart/dnd-time-chart.component";
import { MakeuproomHistogramChartComponent } from "./houseKeeping/makeuproom-histogram-chart/makeuproom-histogram-chart.component";
import { StaffHistogramChartComponent } from "./houseKeeping/staff-histogram-chart/staff-histogram-chart.component";
import { MakeuproomDeltaTimeChartComponent } from "./houseKeeping/makeuproom-delta-time-chart/makeuproom-delta-time-chart.component";
import { ThirtyDaysSummaryComponent } from "./energyManagementPage/thirty-days-summary/thirty-days-summary.component";
import { WeekSummaryComponent } from "./energyManagementPage/week-summary/week-summary.component";
import { ConnectionWidgetComponent } from "./it/connection-widget/connection-widget.component";
import { DownEventsChartComponent } from "./it/down-events-chart/down-events-chart.component";
import { DevicesStatusChartComponent } from "./it/devices-status-chart/devices-status-chart.component";
import { DevicesGridComponent } from "./it/devices-grid/devices-grid.component";
import { ConnectionErrorDeviceTypeComponent } from "./it/connection-error-device-type/connection-error-device-type.component";
import { OfflineDevicesByDayComponent } from "./it/offline-devices-by-day/offline-devices-by-day.component";
import { MessagesChartComponent } from "./it/messages-chart/messages-chart.component";
import { EventService } from "./services/event/event.service";
import { EventsGridComponent } from "./it/events-grid/events-grid.component";
import { AdvancedColdChamberComponent } from "./engineering/advanced-cold-chamber/advanced-cold-chamber.component";
import { ActiveConsumptionChartComponent } from "./engineering/active-consumption-chart/active-consumption-chart.component";
import { RelayPresenceChartComponent } from "./engineering/relay-presence-chart/relay-presence-chart.component";
import { ValveLeftComponent } from "./engineering/valve-left/valve-left.component";
import { ValveRightComponent } from "./engineering/valve-right/valve-right.component";
import { ActiveConsumptionChartsComponent } from "./engineering/active-consumption-charts/active-consumption-charts.component";
import { TelkonetPageComponent } from "./telkonet/telkonet-page/telkonet-page.component";
import { DndGridComponent } from "./houseKeeping/dnd-grid/dnd-grid.component";
import { ThermometersComponent } from "./engineering/thermometers/thermometers.component";
import { CachingInterceptor } from "./services/http-interceptor/caching-interceptor";
import { RequestCacheService } from "./services/http-interceptor/request-cache.service";
import { DndService } from "./services/dndService/dnd-service.service";
import { ThermostatService } from "./services/thermostatService/thermostat.service";
import { NotificationService } from "./services/notification/notification.service";
import { TemperatureService } from "./services/temperatureService/temperature.service";
import { ThermostatOnlineChartComponent } from "./engineering/thermostat-online-chart/thermostat-online-chart.component";
import { MultChartItComponent } from "./it/mult-chart-it/mult-chart-it.component";
import { ChartPieItComponent } from "./it/chart-pie-it/chart-pie-it.component";
import { MultChartEventsComponent } from "./maintenance/mult-chart-events/mult-chart-events.component";
import { ChartPieEventsComponent } from "./maintenance/chart-pie-events/chart-pie-events.component";
import { GridDetailsComponent } from "./maintenance/grid-details/grid-details.component";
import { GridDevicesComponent } from "./it/grid-devices/grid-devices.component";
import { MultiChartAdvancedColdChamberComponent } from "./engineering/multi-chart-advanced-cold-chamber/multi-chart-advanced-cold-chamber.component";

import { AuthGuard } from "./guards/auth-guard/auth.guard";
import { CallbackComponent } from "./modules/starter-page/components/callback/callback.component";
import { NotFoundComponent } from "./modules/starter-page/components/not-found/not-found.component";
import { ProxperConfigService } from "./services/proxperConfig/proxperConfig.service";

// proxper modules
import { StarterPageModule } from "./modules/starter-page/starter-page.module";
import { CRMModule } from "./modules/crm/crm.module";
import { OrderModule } from "./modules/order/order.module";
import { ProxperCommonModule } from "./modules/proxperCommon/proxperCommon.module";
import { NotAllowedComponent } from "./modules/starter-page/components/not-allowed/not-allowed.component";
import { OrderPageComponent } from "./modules/order/components/order-page/order-page.component";
import { RoomControlModule } from "./modules/room-control/room-control.module";
import { UnitDataService } from "./services/unit-data/unit-data.service";
import { DynamicWidgetModule } from "./modules/dynamic-widgets/dynamic-widgets.module";
import { NPSModule } from "./modules/nps/nps.module";
import { NPSPageComponent } from "./modules/nps/components/nps-page/nps-page.component";
import { LoginComponent } from "./login/login.component";
import { JwtModule } from "@auth0/angular-jwt";
import { AuthenticationService } from "./shared/services/authentication.service";
import { LoadingComponent } from "./shared/loading/loading.component";
import { ModalComponent } from "./shared/modal/modal.component";
import { LoadingModalComponent } from "./shared/loading-modal/loading-modal.component";
import { ButtonComponent } from "./shared/button/button.component";

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/assets-customer-base/i18n/", suffix: ".json" },
    { prefix: "./assets/i18n/", suffix: ".json" },
  ]);
}

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GraphConsumeSummaryComponent,
    GraphConsumeWeekComponent,
    GraphOccupancySummaryComponent,
    GraphOccupancyWeekComponent,
    GraphOccupancyRealTimeComponent,
    GraphHvacRealTimeComponent,
    ConsumeDetailsComponent,
    OccupancyDetailsComponent,
    ConsumeWeekDetailsComponent,
    OccupancyWeekDetailsComponent,
    WeekNavigationComponent,
    PowerRealTimeComponent,
    EnergyConsumptionComponent,
    ColdChamberComponent,
    ColdChamberEvolutixComponent,
    ChillerComponent,
    NewDevicesDemoComponent,
    TemperatureRealTimeComponent,
    HomePageComponent,
    SoldInfoComponent,
    EnergyInfoComponent,
    RoomDetailsComponent,
    RoomDevicesInfoComponent,
    PropertyDetailsDevicesComponent,
    ConsumeInfoChartComponent,
    SoldInfoChartComponent,
    RoomsInfoComponent,
    FloorsInfoComponent,
    PropertySummaryComponent,
    BlueprintViewUnitComponent,
    HousekeepingPageComponent,
    OptimizationPageComponent,
    ITPageComponent,
    MaintenancePageComponent,
    PropertySummaryPageComponent,
    EngineeringPageComponent,
    ThermostatModeChartComponent,
    ThermostatFanChartComponent,
    ThermostatStateChartComponent,
    ThermostatOccupancyChartComponent,
    SetpointDifferentialChartComponent,
    DndStateChartComponent,
    DndTimeChartComponent,
    MakeuproomHistogramChartComponent,
    StaffHistogramChartComponent,
    MakeuproomDeltaTimeChartComponent,
    ThirtyDaysSummaryComponent,
    WeekSummaryComponent,
    ConnectionWidgetComponent,
    DownEventsChartComponent,
    DevicesStatusChartComponent,
    DeviceTypeOfflineChartComponent,
    DevicesGridComponent,
    ConnectionErrorDeviceTypeComponent,
    OfflineDevicesByDayComponent,
    MessagesChartComponent,
    EventsGridComponent,
    AdvancedColdChamberComponent,
    ActiveConsumptionChartComponent,
    RelayPresenceChartComponent,
    AdvancedColdChamberComponent,
    ValveLeftComponent,
    ValveRightComponent,
    ActiveConsumptionChartsComponent,
    TelkonetPageComponent,
    DndGridComponent,
    ThermometersComponent,
    ThermostatOnlineChartComponent,
    CoolingDemandChartComponent,
    MultChartItComponent,
    ChartPieItComponent,
    MultChartEventsComponent,
    ChartPieEventsComponent,
    GridDetailsComponent,
    GridDevicesComponent,
    GridDevicesComponent,
    MultiChartAdvancedColdChamberComponent,
    LoginComponent,
    LoadingComponent,
    ModalComponent,
    LoadingModalComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ProxperCommonModule,
    StarterPageModule,
    CRMModule,
    DynamicWidgetModule,
    PropertySummaryModule,
    HomeModule,
    UsageReportModule,
    OrderModule,
    RoomControlModule,
    AutomationNgModule,
    CustomerBaseModule,
    NvD3Module,
    MatSnackBarModule,
    NPSModule,
    // NgxEchartsModule.forRoot({
    //   echarts: () => import('echarts')
    // }),
    JwtModule.forRoot({
      config: { tokenGetter },
    }),
    RouterModule.forRoot([
      {
        path: "callback",
        component: CallbackComponent,
      },
      {
        path: "",
        redirectTo: "selectProperty",
        canActivate: [AuthGuard],
        pathMatch: "full",
      },
      {
        path: "notFound",
        component: NotFoundComponent,
      },
      {
        path: NotAllowedComponent.routerName,
        component: NotAllowedComponent,
      },
      {
        path: "order",
        component: OrderPageComponent,
      },
      {
        path: "nps",
        component: NPSPageComponent,
      },
      {
        path: "produtividade/:property/:sector",
        component: OrderProductivityComponent,
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
      {
        path: "login",
        component: LoginComponent,
      },
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [
    FakeDataService,
    DateService,
    DeviceDataService,
    UnitDataService,
    MessageService,
    HospitalityWeatherService,
    ContextService,
    EventService,
    RequestCacheService,
    DndService,
    ThermostatService,
    TemperatureService,
    NotificationService,
    ProxperConfigService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationTokenInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    BlueprintViewUnitComponent,
    ValveLeftComponent,
    ValveRightComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
