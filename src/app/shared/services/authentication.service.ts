import { PropertiesService } from "@alis/ng-services";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { EventEmitter } from "events";
import { forkJoin, Observable, of } from "rxjs";
import { flatMap, map, tap } from "rxjs/operators";
import { AssetsService } from "../../services/assets/assets.service";
import { HealthService } from "../../services/health/health.service";
import { Permission, UserMetadata } from "../model/permission";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  
  emitter: EventEmitter = new EventEmitter();

  firstLogin: boolean = false;
  
  apiServer: string;

  properties: any[] = [];
  administrativeArea: any;

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private propertiesService: PropertiesService,
    private healthService: HealthService,
    private assetsService: AssetsService,
    private route: ActivatedRoute
  ) {
    this.propertiesService.readProperties("assets/appConfig.properties.json").pipe(
      tap((config) => {
        this.apiServer = config.apiServer,
        this.properties = config.properties,
        this.administrativeArea = config.administrativeArea
      })
    ).subscribe();
  }

  public authenticate(username: string, password: string): Observable<any> {
    this.firstLogin = false;

    const body = `username=${username}&password=${password}&grant_type=password`;

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("lastLoginDate");
    sessionStorage.removeItem("firstlogin");

    return this.httpClient.post<any>(this.apiServer + "/oauth/token", body, {
      headers: this.getHeaders(),
    }).pipe(
      flatMap((userData: any) => {
        if (!userData.lastLoginDate) {
          sessionStorage.setItem("lastLoginDate", null);
          this.firstLogin = true;
        } else {
          sessionStorage.setItem("lastLoginDate", userData.lastLoginDate);
        }

        sessionStorage.setItem("username", username);

        let tokenStr = userData.access_token;
        sessionStorage.setItem("token", tokenStr);

        const jwtJson = this.jwtHelper.decodeToken(tokenStr);
        sessionStorage.setItem(
          'permissions',
          JSON.stringify(jwtJson.permissions)
        );     

        // const propertyIds = jwtJson.permissions
        //   .filter(item => item.permission.startsWith('propertyId'))
        //   .map(item=>item.permission)
        //   .map(permission => permission.replace('propertyId:', ''))
        
        // const administrativeArea = jwtJson.permissions.find(item => item.permission.startsWith('administrativeArea'));
        const propertyIds = this.properties;
        const administrativeArea = this.administrativeArea;           
        
        sessionStorage.setItem('user_metadata', JSON.stringify({propertyIds, administrativeArea}));

        sessionStorage.setItem("lastLoginDate", jwtJson.lastLoginDate);
        this.emitter.emit("successLogEvent", true);
        return  of(userData);
      })
    );
  }

  public authenticateProperty(property: string): Observable<string> {
    return forkJoin([
        this.propertiesService.getAppConfig(), 
        this.propertiesService.readProperties("assets/appConfig.properties.json")
      ]).pipe(
        flatMap(results => {
          const [propertyConfig, localConfig] = results;
          
          if(!propertyConfig.username) {
            console.log(`Property doesn't have username and password to login`)
            return of(false);
          }

          const body = `username=${propertyConfig.username}&password=${propertyConfig.password}&grant_type=password`;
          return this.httpClient.post<any>(localConfig.apiServer + "/oauth/token", body, {
            headers: this.getHeaders(),
          });
        }),
        tap(token => sessionStorage.setItem('property_token', token.access_token))
      );
  } 

  private getHeadersExternalLogin(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa("alis:alis-pass"),
      // Authorization: "Basic " + btoa("nuvola:ycErchiFY"),
      // Authorization: "Basic " + btoa("vertilinc:TRanuSTEAsTa"),
    });
  }

  private getForgotPasswordHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: "Basic " + btoa("alis:alis-pass"),
    });
  }

  public isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem("username");
    if(user === null) {
      const propertyId = document.location.pathname.split('/')[2] || '';
      const shareToken = document.location.search.split('?auth=')[1] || '';
      if(shareToken){
        const jwtJson = this.jwtHelper.decodeToken(shareToken);
        sessionStorage.setItem("username", jwtJson.user_name);
        sessionStorage.setItem("token", shareToken);
        sessionStorage.setItem(
          'permissions',
          JSON.stringify(jwtJson.permissions)
        );     
        const propertyIds = [propertyId];         
        
        sessionStorage.setItem('user_metadata', JSON.stringify({propertyIds}));

        sessionStorage.setItem("lastLoginDate", jwtJson.lastLoginDate);
        return jwtJson.user_name != null;
      }
    }
    return user != null;
  }

  public isPropertyLoggedIn(): boolean {
    let isLoggedIn = sessionStorage.getItem("property_token");
    return isLoggedIn != null;
  }

  public getUsername(): string {
    return sessionStorage.getItem("username");
  }

  public getLastLoginDate() {
    let date = sessionStorage.getItem("lastLoginDate");
    if (date) {
      return new Date(Number.parseInt(date));
    }
    return null;
  }

  public getFirstLogin() {
    // let firstLogin = sessionStorage.getItem('firstLogin');
    console.log(this.firstLogin);

    if (this.firstLogin) {
      console.log(true);

      return true;
    }
    return false;
  }

  public logout(): void {
    const items = ['username', 'lastLoginDate', 'sector', 'token', 'permissions', 'user_metadata', 'property_token'];
    items.forEach(item => sessionStorage.removeItem(item));
    this.emitter.emit("successLogEvent", false);
  }

  public hasPermission(s: string): boolean {
    const permissionsOnSession = sessionStorage.getItem('permissions');
    if (!permissionsOnSession) {
      return false;
    }
    const permissions: Permission[] = JSON.parse(permissionsOnSession);
    return permissions.map((item) => item.permission).includes(s);
  }

  public getPermission(): Permission[] {
    const permissions: Permission[] = JSON.parse(
      sessionStorage.getItem('permissions')
    );
    return permissions;
  }

  public getUserMetadata(): Observable<UserMetadata> {
    return of(JSON.parse(sessionStorage.getItem('user_metadata')));
  }

  forgotPassword(email: string, callbackRelativeURL: string): Observable<any> {
    return this.httpClient.post(
      this.apiServer + "/v1/auth/password/recover",
      {
        email: email,
        language: localStorage.getItem("language"),
        callback:
          location.href.substring(
            0,
            location.href.indexOf(callbackRelativeURL)
          ) + "/password-recovery",
      },
      { headers: this.getForgotPasswordHeaders() }
    );
  }

  forgotPasswordChangePassword(
    otp: string,
    newpassword: string
  ): Observable<any> {
    return this.httpClient.post(
      this.apiServer +
        "/v1/auth/password/otp/change",
      {
        otp: otp,
        newpassword: newpassword,
      },
      { headers: this.getForgotPasswordHeaders() }
    );
  }

  registerEvent(event: string, emitEvent: (result: any) => void) {
    this.emitter.addListener(event, emitEvent);
  }
}
