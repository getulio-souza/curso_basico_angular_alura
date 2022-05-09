import { PropertiesService } from "@alis/ng-services";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { EventEmitter } from "events";
import { forkJoin, Observable, of } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { Authentication } from "../model/authentication";
import { Permission, UserMetadata } from "../model/permission";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  emitter: EventEmitter = new EventEmitter();

  firstLogin: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private propertiesService: PropertiesService
  ) {}

  public authenticate(username: string, password: string): Observable<any> {
    this.firstLogin = false;

    const body = `username=${username}&password=${password}&grant_type=password`;

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("lastLoginDate");
    sessionStorage.removeItem("firstlogin");

    return this.propertiesService.getAppConfig().pipe(
      flatMap((config) => {
        return forkJoin([
          this.httpClient.post<any>(config.authServer + "/oauth/token", body, {
            headers: this.getHeaders(),
          }),
          of(config),
        ]);
      }),
      flatMap((joinedResult: any) => {
        const userData = joinedResult[0];
        const config = joinedResult[1];
        console.log("logou");
        if (!userData.lastLoginDate) {
          sessionStorage.setItem("lastLoginDate", null);
          this.firstLogin = true;
        } else {
          sessionStorage.setItem("lastLoginDate", userData.lastLoginDate);
        }

        sessionStorage.setItem("username", username);

        let tokenStr = userData.access_token;
        sessionStorage.setItem("token", tokenStr);
        localStorage.setItem("access_token", tokenStr);

        const jwtJson = this.jwtHelper.decodeToken(tokenStr);
        sessionStorage.setItem(
          "permissions",
          JSON.stringify(jwtJson.permissions)
        );
        sessionStorage.setItem("lastLoginDate", jwtJson.lastLoginDate);
        this.emitter.emit("successLogEvent", true);
        return forkJoin([
          of(userData),
          of(config),
          this.httpClient.get(config.restApiServer + "/user/me"),
        ]);
      }),
      flatMap((joinedResults) => {
        const userData = joinedResults[0];
        const config = joinedResults[1];
        const user: any = joinedResults[2];
        const observables = [of(userData)];
        if (user)
          observables.push(
            this.httpClient.get(
              config.restApiServer + "/practitioner/" + user.practitionerId
            )
          );
        return forkJoin(observables);
      }),
      map((joinedResults) => {
        const userData = joinedResults[0];
        if (joinedResults.length > 1) {
          const practitioner: any = joinedResults[1];
          if (practitioner)
            sessionStorage.setItem("sector", practitioner.sector[0]);
        }
        return userData;
      })
    );
  }

  public authenticateExternalLogin(
    username: string,
    password: string
  ): Observable<boolean> {
    let body = new Authentication();
    body.username = username;
    body.password = password;

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("lastLoginDate");

    return this.httpClient
      .post<any>(
        PropertiesService.properties.integrationServer +
          "/egress/loginExternal",
        body,
        { headers: this.getHeadersExternalLogin() }
      )
      .pipe(
        map((userData) => {
          return userData;
        })
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
    });
  }

  private getForgotPasswordHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: "Basic " + btoa("alis:alis-pass"),
    });
  }

  public isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem("username");
    return user != null;
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
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("lastLoginDate");
    sessionStorage.removeItem("sector");
    this.emitter.emit("successLogEvent", false);
  }

  public hasPermission(s: string): boolean {
    const permissionsOnSession = sessionStorage.getItem("permissions");
    if (!permissionsOnSession) {
      return false;
    }
    const permissions: Permission[] = JSON.parse(permissionsOnSession);
    return permissions.map((item) => item.permission).includes(s);
  }

  public getPermission(): Permission[] {
    const permissions: Permission[] = JSON.parse(
      sessionStorage.getItem("permissions")
    );
    return permissions;
  }

  public getUserMetadata(): Observable<UserMetadata> {
    return of({ roles: this.getPermission().map((value) => value.permission) });
  }

  getToken(): string {
    const accessToken = localStorage.getItem("access_token");
    return accessToken;
  }

  forgotPassword(email: string, callbackRelativeURL: string): Observable<any> {
    return this.httpClient.post(
      PropertiesService.properties.authServer + "/forgotpassword",
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
      PropertiesService.properties.authServer +
        "/forgotpassword/changepassword",
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
