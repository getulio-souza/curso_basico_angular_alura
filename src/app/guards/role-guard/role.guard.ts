import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropertiesService } from '@alis/ng-services';
import { NotAllowedComponent } from '../../modules/starter-page/components/not-allowed/not-allowed.component';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private propertiesService: PropertiesService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    const metadata$ = of({roles: this.authService.getPermission().map(value => value.permission)});
    const appConfig$ =  this.propertiesService.getAppConfig();
    const requests = [metadata$ , appConfig$];

    return forkJoin(requests).pipe(map((res) => {
      const userMetadata = res[0];
      const config = res[1];
      const userRoles: Array<string> = userMetadata.roles != null ? userMetadata.roles : [];

      const rolesConfig = this.getRoleConfig(config);
     
      if (rolesConfig == null) {
        // there is no roles configured
        // allow
        return true;
      }

      // there is role configured;     
      const routerPath = this.getRouterPath(next)
      const allowedRoutes = this.buildAllowRoutesArray(userRoles,rolesConfig);

      let allowed = allowedRoutes.includes(routerPath);
      
      if(allowed){
        return true;
      }
    
      console.warn("User has tried to access routerPath '" + routerPath + 
      "' but his role is not allowed to do it");

      this.router.navigateByUrl(NotAllowedComponent.routerName);
      
      return false;
    }));
  }

  private buildAllowRoutesArray(userRoles: Array<string>,rolesConfig): Array<string> {
    let allowRoutes = [];

    userRoles.forEach( userRole => {
      const route = rolesConfig[userRole];
      if(route != null) {
        allowRoutes = allowRoutes.concat(route);
      } else {
        console.warn("Could not find role '" + userRole + "' in proxperConfigs");
      }
    });


    return allowRoutes;
  }


  private getRoleConfig(config) {
    const sidebarConfig = config.sidebar;
      if (sidebarConfig == null) {
        console.warn("There is no sidebarConfig in proxperConfigs");
        return false;
      }

      return sidebarConfig.roles;
  }


  private getRouterPath(next: ActivatedRouteSnapshot) {
     //routeppath, ex: 'engineering'
     let routerPath = next.routeConfig.path;

     if(routerPath.includes("/")){
       // path can be bigger, like the example below:
       // consumeDetails/:energyGroupId
       routerPath = routerPath.split("/")[0];
     }

     return routerPath;

  }
}




