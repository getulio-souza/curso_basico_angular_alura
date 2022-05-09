import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  acessoExterno = false;
  auth: { loggedIn: boolean; } = {loggedIn: false};

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) {
    setTimeout(() => {
      this.auth = {loggedIn: this.authenticationService.isUserLoggedIn()}
      this.authenticationService.registerEvent('successLogEvent', (result: boolean)=> this.auth.loggedIn = result);
      this.route.firstChild.params.subscribe(resp => {
        if (resp['property'] && resp['sector']) {
          this.acessoExterno = true;
        }
      });
    }, 1000);
  }

  ngOnInit() {
    // REMOVAL AUTH0 - não tem mais necessidade
    // this.auth.localAuthSetup();
  }
  
}
