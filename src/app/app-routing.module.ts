import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth-guard/auth.guard";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  /* {
    path: 'callback',
    component: CallbackComponent
  }, */
  {
    path: "",
    redirectTo: "selectProperty",
    canActivate: [AuthGuard],
    pathMatch: "full",
  } /* , {
    path: 'notFound',
    component: NotFoundComponent
  }, {
    path: '**',
    component: NotFoundComponent
  } */,
  {
    path: "login",
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
