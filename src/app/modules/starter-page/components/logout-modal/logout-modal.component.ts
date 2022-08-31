import { Component, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../../shared/services/authentication.service";
import { LogoutComponent } from "../logout/logout.component";

@Component({
  selector: "app-logout-modal",
  templateUrl: "./logout-modal.component.html",
  styleUrls: ["./logout-modal.component.scss"],
})
export class LogoutModalComponent implements OnInit {
  username: string;
  loggedOut: boolean;

  constructor(
    private logoutComponent: LogoutComponent,
    public auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.logoutComponent.getUserName();
    this.loggedOut = this.auth.isUserLoggedIn();
  }

  handleModal() {
    this.logoutComponent.handleModal();
  }
  logout() {
    this.auth.logout();
    this.router.navigate(["/login"], {
      queryParams: { url: this.router.routerState.snapshot.url },
    });
  }
}
