import { PropertiesService } from '@alis/ng-services';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
/**
 * {{AuthorizationTokenInterceptor}} intercepts urls that contains {{INTERCEPT_URLS}}
 * Adding to it the bearer Authorization token provided
 * by requesting it using the auth0 token
 */
export class AuthorizationTokenInterceptor implements HttpInterceptor {

  cooldown: moment.Moment;
  cooledDownUrl;

  // lets intercept and add authorization token to all intercepts
  // that contains the following string
  private static INTERCEPT_URLS = ["automation", "tracking", "state", "user/me"];

  constructor(private propertiesService: PropertiesService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check if should add Authorization Token to the current request
    const addAuthToken = this.shoulddAuthorizationToken(request.url);
    if (!addAuthToken) {
      return next.handle(request);
    }

    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      });
    }
    if (request.method == 'POST') {
      if (!request.url.includes('order/')) {
        if (
          request.url == this.cooledDownUrl &&
          this.cooldown &&
          this.cooldown.isAfter(moment.now())
        ) {
          let seconds = this.cooldown.diff(moment(), 'seconds');
          console.log(request.url + ' cooling down for ' + seconds + ' seconds');
          return of(null);
        }
      }
      this.cooldown = moment().add(1, 'seconds');
      this.cooledDownUrl = request.url;
    }

    return next.handle(request);
  }

  shoulddAuthorizationToken(currentUrl: string) {

    const urls = AuthorizationTokenInterceptor.INTERCEPT_URLS

    for (let i = 0; i < urls.length; i++) {
      if (currentUrl.includes(urls[i])) {
        return true;
      }
    }

    return false;
  }



}