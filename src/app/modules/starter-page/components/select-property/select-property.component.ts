import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ProxperConfigService } from '../../../../services/proxperConfig/proxperConfig.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-select-property',
  templateUrl: './select-property.component.html',
  styleUrls: ['./select-property.component.scss']
})
export class SelectPropertyComponent implements OnInit {

  @Output() onEnterPropertyEmitter = new EventEmitter<any>();

  appIsReady = false;
  showChooseProperties = false;
  availableProperties = new Array();

  needsConfiguration = false;

  proxperBaseUrl;
  loggedIn: boolean;

  constructor(
    public auth: AuthenticationService,
    public proxperConfigService: ProxperConfigService,
    private router: Router) { }

  ngOnInit() {
    this.loggedIn = this.auth.isUserLoggedIn();
    this.proxperConfigService.updateConfigAndAvailableProperties(() => {
      let availableProperties = this.proxperConfigService.getAvailableProperties();
      if (availableProperties == null || availableProperties.length == 0) {
        // case no property is available
        console.warn("there is no property configured");
        this.goToNotFoundConfig();
      } else if (availableProperties.length == 1) {
        //case only one property is available
        this.onEnterSelectedProperty({ selectedPropertyId: availableProperties[0] });
      } else {
        //multi property case, should show select property component
      }
      
      // else
      //multi property case, should show select property component

      this.appIsReady = true;
    })
  }

  goToNotFoundConfig() {
    this.router.navigateByUrl("/noRegisteredProperty");
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { queryParams: { url: this.router.routerState.snapshot.url } });
  }

  onEnterSelectedProperty(event) {
    this.router.navigateByUrl("/propertyApp/" + event.selectedPropertyId);
  }

}