import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from '@alis/ng-services';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProxperConfigService {


  private proxperBaseUrl;
  private availableProperties: Array<string>;

  constructor(private propertiesService: PropertiesService) {
  }

  setPropertyAndLoadConfigs(propertyId) {
    let propertyProxperUrl = this.buildPropertiesUrl(this.proxperBaseUrl, propertyId);
    this.propertiesService.setPropertiesUrl(propertyProxperUrl);
  }

  updateConfigAndAvailableProperties(afterSet) {

    this.availableProperties = ['capjuluca', 'copapalace', 'acqualina', 'einsteinsp', 'unimedsorocaba']

    return this.propertiesService.getAppConfig().pipe(
      tap((config) => {
        this.proxperBaseUrl = config.proxperConfigsBaseUrl;
      }))

    // ANALISAR IMPACTO - Precisa de variaveis que enviei como imagem para o odair.
    
    // this.auth.getUser$().subscribe((user) => {
    //   this.auth.processUserMetadata(user).subscribe((res) => {
    //     this.proxperBaseUrl = res[0];
    //     this.availableProperties = res[1];
    //     afterSet();
    //   });
    // });
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
