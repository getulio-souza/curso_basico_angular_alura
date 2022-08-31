import { NPSPageComponent } from "./components/nps-page/nps-page.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",

    data: {
      breadcrumb: null,
    },
    children: [
      {
        path: "",
        component: NPSPageComponent,
        data: {
          reuse: true,
          breadcrumb: null,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NPSRoutingModule {}
