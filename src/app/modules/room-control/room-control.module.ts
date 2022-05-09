import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProxperCommonModule } from '../proxperCommon/proxperCommon.module';
import { RoomControlPage } from './components/room-control-page/room-control-page.component';
import { RoomControlComponent } from './components/room-control/room-control.component';
import { RoomsGridComponent } from './components/rooms-grid/rooms-grid.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
    ]),
    ProxperCommonModule
  ],
  declarations: [RoomControlPage, RoomControlComponent, RoomsGridComponent]
})
export class RoomControlModule { }
