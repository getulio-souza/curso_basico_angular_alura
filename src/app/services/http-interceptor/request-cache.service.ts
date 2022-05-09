import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxTime = 3000;

@Injectable()
export class RequestCacheService {

  cacheMap = new Map();

  getCachedResponse(req: HttpRequest<any>): HttpResponse<any> {
    const urlWithParams = req.urlWithParams;
    const body = req.serializeBody();

    // cacheMap key is url + body
    const cached = this.cacheMap.get(urlWithParams + body);
    
    if (!cached) {
      return null;
    }

    const isExpired = cached.lastRead < (Date.now() - maxTime);
    if (!isExpired) {
      return cached.response;
    }

    return null;

  }

  putCachedResponse(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const body = req.serializeBody();
    const entry = { url, response, lastRead: Date.now() };

    // cacheMap key is url + body
    this.cacheMap.set(url + body, entry);
    const minDateToExpire = Date.now() - maxTime;

    this.cacheMap.forEach(entry => {
      // lets delete old data
      if (entry.lastRead < minDateToExpire) {
        this.cacheMap.delete(entry.url);
      }

    });
  }
}