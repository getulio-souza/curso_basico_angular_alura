import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProxperConfigService } from '../../services/proxperConfig/proxperConfig.service';
import { PropertiesService } from '@alis/ng-services';

@Injectable({
  providedIn: 'root'
})
export class ProxperConfigGuard implements CanActivate {

  constructor(
    private proxperConfigService: ProxperConfigService,
    private propertiesService: PropertiesService,
    private router: Router) { }

  private emitChangeSource = new Subject<any>();

  private canActivate$ = this.emitChangeSource.asObservable();



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    this.isPropertyAvailable(next);

    return this.canActivate$.pipe(
      map((emitterData) => {
        if (!emitterData.isAllowed) {
          /* the required property is not allowed
             lets check 3 cases
             1) If this user has no property, lets navigate to /noRegisteredProperty
             2) If this user only has 1 property, lets navigate to it
             3) if this user has multiple property, lets navigate to /selectProperty
          */
          if (emitterData.propertiesAvailable == null || emitterData.propertiesAvailable.length == 0) {
            this.router.navigateByUrl("/noRegisteredProperty");
          } else if (emitterData.propertiesAvailable.length == 1) {
            this.router.navigateByUrl("/propertyApp/" + emitterData.propertiesAvailable[0]);
          } else {
            this.router.navigateByUrl("/selectProperty");
          }
          return false;
        } else {
          return true;
        }
      }));
  }
  private async isPropertyAvailable(next: ActivatedRouteSnapshot) {

    await this.proxperConfigService.updateConfigAndAvailableProperties();

    let emitterData = {};
    let propertiesAvailable = this.proxperConfigService.getAvailableProperties();
    let propertyIsAvaible;
    let selectedProperty = next.params['propertyId'];
    if (propertiesAvailable != null && propertiesAvailable.includes(selectedProperty)) {
      propertyIsAvaible = true;
    } else {
      propertyIsAvaible = false;
    }

    emitterData['isAllowed'] = propertyIsAvaible;
    emitterData['selectedProperty'] = selectedProperty;
    emitterData['propertiesAvailable'] = propertiesAvailable;

    this.proxperConfigService.setPropertyAndLoadConfigs(selectedProperty);
    this.emitChangeSource.next(emitterData);

    return 
  }

  

}
