import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { SidebarComponent } from "../../../app/modules/starter-page/components/sidebar/sidebar.component";
import { Breadcrumb } from "./breadcrumbs.model";
import { BreadcrumbService } from "./breadcrumbs.service";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
  providers: [SidebarComponent],
})
export class BreadcrumbsComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private router: Router,
    private sidebarComponent: SidebarComponent
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  goToRoute(breadcrumb: Breadcrumb) {
    this.sidebarComponent.addClass(breadcrumb.url);
    this.router.navigate([`${breadcrumb.url}`]);
  }
}
