import { Component, OnInit, Output } from "@angular/core";
import { LogoutComponent } from "../logout/logout.component";

@Component({
  selector: "app-logout-modal",
  templateUrl: "./logout-modal.component.html",
  styleUrls: ["./logout-modal.component.scss"],
})
export class LogoutModalComponent implements OnInit {
  //variavel para nome
  username: string;

  constructor(private logoutComponent: LogoutComponent) {}

  ngOnInit() {
    this.username = this.logoutComponent.getUserName();
  }

  handleModal() {
    this.logoutComponent.handleModal();
  }
}
