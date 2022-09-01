import { Component, OnInit } from "@angular/core";
import { Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../../../../shared/services/authentication.service";

@Component({
  selector: "app-no-registered-properties",
  templateUrl: "./no-registered-properties.component.html",
  styleUrls: ["./no-registered-properties.component.scss"],
})
export class NoRegisteredPropertiesComponent implements OnInit {
  loggedIn: boolean;

  constructor(public auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.loggedIn = this.auth.isUserLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"], {
      queryParams: { url: this.router.routerState.snapshot.url },
    });
  }
}
