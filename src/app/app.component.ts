import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { SimpleNotificationComponent, SimpleNotificationService } from '@alis/proxper-base';
import { PropertiesService } from '@alis/ng-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  acessoExterno = false;
  auth: { loggedIn: boolean; } = {loggedIn: false};

  ready = false;

  @ViewChild('simpleNotificationComponent', { static: false })
  simpleNotificationComponent: SimpleNotificationComponent;

  constructor(private route: ActivatedRoute, 
    private authenticationService: AuthenticationService,
    private simpleNotificationService: SimpleNotificationService) {
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

  ngAfterViewInit() {
    this.simpleNotificationService.addListener(
      this.simpleNotificationComponent
    );
  }

}
