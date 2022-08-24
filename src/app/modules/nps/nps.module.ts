import { NpsGraphicsViewComponent } from "./components/nps-page/nps-graphics-view/nps-graphics-view.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ProxperCommonModule } from "../proxperCommon/proxperCommon.module";
import { NPSPageComponent } from "./components/nps-page/nps-page.component";
import { DynamicWidgetModule } from "../dynamic-widgets/dynamic-widgets.module";
import { CollapseGridNPSComponent } from "./components/collapse-grid-nps/collapse-grid-nps.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([]),
    ProxperCommonModule,
    DynamicWidgetModule,
  ],
  declarations: [
    NPSPageComponent,
    CollapseGridNPSComponent,
    NpsGraphicsViewComponent,
  ],
  exports: [CollapseGridNPSComponent],
})
export class NPSModule {}
