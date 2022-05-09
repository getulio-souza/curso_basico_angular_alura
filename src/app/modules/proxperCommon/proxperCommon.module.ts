import { ModalControl } from './components/modal-control/modal-control.component';
import { AlertDialog } from './components/alert-dialog/alert-dialog.component';
import { AlertCarousel } from './components/alert-carousel/alert-carousel.component';
import { CalendarComponent } from './../../home/calendar/calendar.component';
import { ClockComponent } from './../../home/clock/clock.component';
import { WeatherComponent } from './../../home/weather/weather.component';
import { DataSvgComponent } from './../../engineering/data-svg/data-svg.component';
import { ChartFloorPlainComponent } from './../../home/chart-floor-plain/chart-floor-plain.component';
import { ProxperBaseModule } from '@alis/proxper-base';
import { BlueprintViewComponent } from './../../home/blueprint-view/blueprint-view.component';
import { CardSummaryComponent } from './../../home/card-summary/card-summary.component';
import { GridStateComponent } from './../../grid-state/grid-state.component';
import { HistoryNavigationComponent } from './../../history-navigation/history-navigation.component';
import { BuildingUnitFilterComponent } from './../../building-unit-filter/building-unit-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CollapseHamburguerButtonComponent } from '../../collapse-hamburguer-button/collapse-hamburguer-button.component';
import { NvD3Module } from 'ng2-nvd3';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '../../grid/grid.component';
import { HistoryNavigationPickComponent } from './../../history-navigation-pick/history-navigation-pick.component';


// prime ng imports
import { AutoCompleteModule, MessageModule, CalendarModule, DialogModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DropdownModule } from 'primeng/dropdown';
import { RoomInfoDialogComponent } from '../../propertySummaryPage/room-info-dialog/room-info-dialog.component';
import { MatIconModule } from '@angular/material';
import { SummaryInfoComponent } from '../../home/summary-info/summary-info.component';
import { NotAllowedComponent } from '../starter-page/components/not-allowed/not-allowed.component';
import { HVACControlGroupComponent } from '../../engineering/hvac-control-group/hvac-control-group.component';
import { RelayControlComponent } from '../../engineering/relay-control/relay-control.component';
import { CisternControlComponent } from '../../engineering/cistern-control/cistern-control.component';
import { FilterComponent } from '../../filter/filter.component';
import { ManometerControlComponent } from '../../engineering/manometer-control/manometer-control.component';
import { ThermometerControlComponent } from '../../engineering/thermometer-control/thermometer-control.component';
import { MasterOffControlComponent } from '../../engineering/master-off-control/master-off-control.component';
import { HVACControlDeviceComponent } from '../../engineering/hvac-control-device/hvac-control-device.component';
import { HistoryNavigationInputedComponent } from '../../history-navigation-inputed/history-navigation-inputed.component';
import { CardInfoSummaryComponent } from '../../card-info-summary/card-info-summary.component';
import { CardInfoSummaryItemComponent } from '../../card-info-summary-item/card-info-summary-item.component';



@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),

    // libs
    ProxperBaseModule,

    // libs modules
    NvD3Module,
    FormsModule,
    DropdownModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    DragDropModule,
    ProgressSpinnerModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    CarouselModule,
    DropdownModule,
    CalendarModule,
    DialogModule,

  ],
  declarations: [
    CollapseHamburguerButtonComponent,
    BuildingUnitFilterComponent,
    GridComponent,
    GridStateComponent,
    RoomInfoDialogComponent,
    HistoryNavigationComponent,
    HistoryNavigationPickComponent,
    HistoryNavigationInputedComponent,
    DataSvgComponent,
    NotAllowedComponent,
    HVACControlGroupComponent,
    HVACControlDeviceComponent,
    RelayControlComponent,
    CisternControlComponent,
    ManometerControlComponent,
    ThermometerControlComponent,
    MasterOffControlComponent,
    AlertCarousel,
    AlertDialog,
    ModalControl,

    FilterComponent,
    //property summary
    SummaryInfoComponent,
    CardSummaryComponent,
    CardInfoSummaryComponent,
    CardInfoSummaryItemComponent,
    BlueprintViewComponent,
    ChartFloorPlainComponent,

    //home
    WeatherComponent,
    ClockComponent,
    CalendarComponent

  ],
  exports: [
    CollapseHamburguerButtonComponent,
    BuildingUnitFilterComponent,
    GridComponent,
    GridStateComponent,
    RoomInfoDialogComponent,
    HistoryNavigationComponent,
    HistoryNavigationPickComponent,
    HistoryNavigationInputedComponent,
    FilterComponent,
    DataSvgComponent,
    NotAllowedComponent,
    HVACControlGroupComponent,
    HVACControlDeviceComponent,
    MasterOffControlComponent,

    RelayControlComponent,
    CisternControlComponent,
    ManometerControlComponent,
    ThermometerControlComponent,
    AlertCarousel,
    AlertDialog,
    ModalControl,




    //property summary
    SummaryInfoComponent,
    CardInfoSummaryComponent,
    CardInfoSummaryItemComponent,
    CardSummaryComponent,
    BlueprintViewComponent,
    ChartFloorPlainComponent,

    //home
    WeatherComponent,
    ClockComponent,
    CalendarComponent,

    MatIconModule,
    NvD3Module,
    TableModule,
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    DragDropModule,
    ProgressSpinnerModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    CarouselModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ProxperBaseModule
  ],
  providers: [
    DatePipe
  ]
})
export class ProxperCommonModule { }
