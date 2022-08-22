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
  private static INTERCEPT_URLS = ["automation", "state", "user/me", "activities"];

  private static INTERCEPT_URLS_PROXPER_AUTH = ['v1/order', 'v1/whiteboard', 'v1/tracking', 'v1/events']

  private static DO_NOT_INTERCEPT_URLS_PROXPER_AUTH = ['v1/whiteboard/practitioner']

  constructor(private propertiesService: PropertiesService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check if should add Authorization Token to the current request
    const addAuthToken = this.shouldAuthorizeToken(request.url);
    if (!addAuthToken) {
      return next.handle(request);
    }

    if (sessionStorage.getItem('username') && this.hasTokenOnSessionStorage(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.hasTokenOnSessionStorage(request.url),
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

  hasTokenOnSessionStorage(currentUrl: string) {

    let token = sessionStorage.getItem('token')

    const matchesProxperAuth = AuthorizationTokenInterceptor.INTERCEPT_URLS_PROXPER_AUTH.some(url => currentUrl.includes(url));
    
    if(sessionStorage.getItem('property_token') !== "undefined" && matchesProxperAuth) {
      token = sessionStorage.getItem('property_token')
    }
    
    return token;
    
  }

  shouldAuthorizeToken(currentUrl: string) {

    const matchesNormalAuth = AuthorizationTokenInterceptor.INTERCEPT_URLS.some(url => currentUrl.includes(url));
    const matchesProxperAuth = AuthorizationTokenInterceptor.INTERCEPT_URLS_PROXPER_AUTH.some(url => currentUrl.includes(url));

    const doNotFilter = AuthorizationTokenInterceptor.DO_NOT_INTERCEPT_URLS_PROXPER_AUTH.some(url => currentUrl.includes(url));

    return (matchesNormalAuth || matchesProxperAuth) && !doNotFilter;

  }

}

