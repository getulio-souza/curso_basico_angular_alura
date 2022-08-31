import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, TranslateModule.forChild()],
  exports: [BreadcrumbsComponent],
})
export class SharedModule {}
