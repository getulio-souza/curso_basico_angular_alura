import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from '@alis/ng-services';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProxperConfigService {


  private proxperBaseUrl;
  private availableProperties: Array<string>;

  constructor(private propertiesService: PropertiesService, private authenticationService: AuthenticationService) {
  }

  setPropertyAndLoadConfigs(propertyId) {
    let propertyProxperUrl = this.buildPropertiesUrl(this.proxperBaseUrl, propertyId);
    this.propertiesService.setPropertiesUrl(propertyProxperUrl);
  }

  async updateConfigAndAvailableProperties() {

    const userMetadata = await this.authenticationService.getUserMetadata().toPromise();
    this.availableProperties = userMetadata.propertyIds;

    this.proxperBaseUrl = await this.getProxperUrl();
  }

  async getProxperUrl() {
    const properties = await this.propertiesService.readProperties("assets/appConfig.properties.json").toPromise();
    let proxperConfigsUrl = properties['proxperConfigsBaseUrl'];
    if (proxperConfigsUrl == null) {
      console.error("Could not find 'proxperConfigsBaseUrl' in properties file");
    }
    return proxperConfigsUrl;
  }

  public getAvailableProperties() {
    return this.availableProperties;
  }
  public getProxperBaseUrl() {
    return this.proxperBaseUrl;
  }


  private buildPropertiesUrl(proxperUrl, propertyId) {
    return proxperUrl + "/propertyId/" + propertyId;
  }





}
