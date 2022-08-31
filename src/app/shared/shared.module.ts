import { LoadingComponent } from "./loading/loading.component";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [BreadcrumbsComponent, LoadingComponent],
  imports: [CommonModule, TranslateModule.forChild()],
  exports: [BreadcrumbsComponent, LoadingComponent],
})
export class SharedModule {}
