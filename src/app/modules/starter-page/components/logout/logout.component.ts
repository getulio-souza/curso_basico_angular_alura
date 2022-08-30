import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticationService } from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  username:string;
  lastLogin: string;


  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.username = this.getUserName();
    this.lastLogin = this.getUserLastLogin();
  }

 getUserName(): string{
  return this.authenticationService.getUsername();
 }

 getUserLastLogin(): string{
    this.authenticationService.getLastLoginDate();
    return this.formatDateLong(this.authenticationService.getLastLoginDate())

 }

 formatDateLong(date: Date): string {
  return moment(date).format('DD/MM/YYYY - HH:mm') + 'h';
}
}
