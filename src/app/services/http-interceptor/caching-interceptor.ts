import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';


import { RequestCacheService } from './request-cache.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(private cacheService: RequestCacheService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let cachedResponse = this.cacheService.getCachedResponse(request);
    
    if(request.url.includes("automation")){
      // automation should never save cache
      this.removeCache(request);
      cachedResponse = null;
    } else {

      // any other url lets check if there is a force request
      if(request.params.has("forceRequest") ){
        //force sending a new request
        let forceRequest = request.params.get("forceRequest");
        if(forceRequest){
          forceRequest = forceRequest.toString();
        }
        if(forceRequest == 'true'){
          this.removeCache(request);
          cachedResponse = null;
        }
      }
    }

    
    // if it already has cachedResponse, 
    // just return it as an observable
    // else, send a request
    if (cachedResponse != null) {
      return of(cachedResponse);
    }

    return this.sendRequest(request,next);

  }

  private removeCache(request: HttpRequest<any>){
    request.params.delete("forceRequest");
    this.cacheService.cacheMap.delete(request.urlWithParams + request.body);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.putCachedResponse(req, event);
        }
      })
    );
  }
}