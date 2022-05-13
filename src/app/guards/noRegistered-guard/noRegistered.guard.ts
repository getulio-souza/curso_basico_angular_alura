import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProxperConfigService } from '../../services/proxperConfig/proxperConfig.service';

@Injectable({
  providedIn: 'root'
})
export class NoRegisteredGuard implements CanActivate {

  constructor(
    private proxperConfigService: ProxperConfigService,
    private router: Router) { }

  private emitChangeSource = new Subject<any>();

  private canActivate$ = this.emitChangeSource.asObservable();



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    this.checkAvailableProperties();

    return this.canActivate$.pipe(
      map((propertiesAvailable) => {

        if (propertiesAvailable == null || propertiesAvailable.length == 0) {
          // continue to noRegistered component
          return true;
        } else {
          if (propertiesAvailable.length == 1) {
            //go to the unique property
            this.router.navigateByUrl("/propertyApp/" + propertiesAvailable[0]);
          } else {
            //go to select property
            this.router.navigateByUrl("/selectProperty");
          }

          return false;
        }
      }));
  }

  private async checkAvailableProperties() {
    await this.proxperConfigService.updateConfigAndAvailableProperties();
    let propertiesAvailable = this.proxperConfigService.getAvailableProperties();
    this.emitChangeSource.next(propertiesAvailable);
  }



}
