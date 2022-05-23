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

  async ngOnInit() {
    this.loggedIn = this.auth.isUserLoggedIn();
    await this.proxperConfigService.updateConfigAndAvailableProperties()
    let availableProperties = this.proxperConfigService.getAvailableProperties();

    const thereIsNoPropertyConfigured = availableProperties == null || availableProperties.length == 0;
    const thereIsOnlyOneProperty = availableProperties.length == 1;

    if (thereIsNoPropertyConfigured) {
      console.warn("there is no property configured");
      this.goToNotFoundConfig();
    } else if (thereIsOnlyOneProperty) this.selectFirstProperty(availableProperties);
    
    this.appIsReady = true;
  }

  private async selectFirstProperty(availableProperties: string[]) {
    await this.onEnterSelectedProperty({ selectedPropertyId: availableProperties[0] });
  }

  public goToNotFoundConfig() {
    this.router.navigateByUrl("/noRegisteredProperty");
  }

  public logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { queryParams: { url: this.router.routerState.snapshot.url } });
  }

  public async onEnterSelectedProperty(event) {
    const {selectedPropertyId} = event;
    this.router.navigateByUrl("/propertyApp/" + selectedPropertyId);
  }

}