import { ContextService } from '../context/context.service';
import { DateService } from './../date/date.service';
import { map, switchAll } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AbstractService, PropertiesService } from '@alis/ng-services';
import { FakeDataService } from '../fake-data/fake-data.service';
import { of } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';


export enum EVENT_TAG {
  ON_SET_EVENT = 'onSetEvent',
  ON_EVENT = 'onEvent',
  CALL_EVENT = 'CallEvent',
  WEB_RTC = 'WebRTC'
}

export enum CALL_EVENT {
  ANSWERED_CALL = 'ANSWERED_CALL',
  MISSED_CALL = 'MISSED_CALL',
  REJECTED_CALL = 'REJECTED_CALL'
}
export enum EVENT_TYPE {
  SMART_CONTROL = 'smartControl',
  PMS_CHANGE = 'PMSChangeEvent',
  PMS_AVAILABILITY = 'PMSAvailability',
}

@Injectable({
  providedIn: 'root'
})
export class EventService extends AbstractService {

  
  private static apiPathProperty = 'eventsUrl';

  constructor(private fakeDataService: FakeDataService,
    propertiesService: PropertiesService, private dateService: DateService,
    private contextService: ContextService,
    private http: HttpClient) {
    super(EventService.apiPathProperty, propertiesService);
  }

   /********************************** FAKE EVENTS *********************************/
  getCardsList() {
    // using fake data
    return of(this.fakeDataService.getFakeEventsCard());
  }

  getEventsByStatus(type) {
    // using fake data
    return of(this.fakeDataService.getFakeEventsListByStatus(type));
  }

  getDeviceList(type) {
    return of(this.fakeDataService.getFakeDeviceList(type));
  }
 /********************************** END FAKE EVENTS *********************************/


 /********************************** EVENTS ********************************
  * 
  */

  getEventsByTag(
  context: string, tag: string,
  eventType: string, eventSubtype: string,start: number, end: number) {
  return this.getApiUrl().pipe(map((apiUrl) => {
    let url = this.buildEventsUrl(apiUrl, context, 'tag', tag);
    const params = this.buildReportQueryParams(eventType, eventSubtype, start, end,null,null,true);
    return this.contextService.getRequestObservable(url + params, this.http.get(url, { params: params }));
  }), switchAll());
}

getEventsBySubject(
  context: string, subject: string,
  eventType: string, eventSubtype: string, start: number, end: number) {
  return this.getApiUrl().pipe(map((apiUrl) => {
    let url = this.buildEventsUrl(apiUrl, context, 'subject', subject);
    const params = this.buildReportQueryParams(eventType, eventSubtype, start, end,null,null,true);
    return this.contextService.getRequestObservable(url + params, this.http.get(url, { params: params }));
  }), switchAll());
}

getEventsBySource(
  context: string, source: string,
  eventType: string, eventSubtype: string, start: number, end: number) {
  return this.getApiUrl().pipe(map((apiUrl) => {
    let url = this.buildEventsUrl(apiUrl, context, 'source', source);
    const params = this.buildReportQueryParams(eventType, eventSubtype, start, end,null,null,true);
    return this.contextService.getRequestObservable(url + params, this.http.get(url, { params: params }));
  }), switchAll());
}








/********************************** REPORTS ********************************

/********************************** BY SUBJECT *********************************/
  getReportBySubject(
    context: string, subject: string, resolution: string,
    eventType: string, eventSubtype: string, start: number, end: number, period: string,
    periodFilter: string, body: Object, forceRequest?) {
    return this.getApiUrl().pipe(map((apiUrl) => {
      let url = this.buildReportEventUrl(apiUrl, context, 'subject', subject, resolution);
      const params = this.buildReportQueryParams(eventType, eventSubtype, start, end, period, periodFilter,forceRequest);
      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params }));
    }), switchAll());
  }


  /********************************** BY Source *********************************/
  getReportBySource(
    context: string, source: string, resolution: string,
    eventType: string, eventSubtype: string, start: number, end: number, period: string,
    periodFilter: string, body: Object, forceRequest?) {
    return this.getApiUrl().pipe(map((apiUrl) => {
      let url = this.buildReportEventUrl(apiUrl, context, 'source', source, resolution);
      const params = this.buildReportQueryParams(eventType, eventSubtype, start, end, period, periodFilter,forceRequest);
      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params }));
    }), switchAll());
  }

  /********************************** BY Tag *********************************/
  getReportByTag(
    context: string, tag: string, resolution: string,
    eventType: string, eventSubtype: string, start: number, end: number, period: string,
    periodFilter: string, body: Object, forceRequest?) {
    return this.getApiUrl().pipe(map((apiUrl) => {
      let url = this.buildReportEventUrl(apiUrl, context, 'tag', tag, resolution);
      const params = this.buildReportQueryParams(eventType, eventSubtype, start, end, period, periodFilter,forceRequest);
      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params }));
    }), switchAll());
  }





  /******************************** Common methods ************************/

  private buildReportEventUrl(baseUrl: string, context: string, queryName: string, queryValue: string, resolution: string) {
    return baseUrl + '/report/context/' + context + '/' + queryName + '/' + queryValue + '/resolution/' + resolution;
  }

  private buildEventsUrl(baseUrl: string, context: string, queryName: string, queryValue: string) {
    return baseUrl + '/event/' + queryName + "/" + context + '/' + queryValue;
  }

  private buildReportQueryParams(
    eventType: string,
    eventSubtype: string,
    startDate: number,
    endDate: number,
    period: string,
    periodFilter: string,
    forceRequest) {

    let httpParams = new HttpParams();

    if (forceRequest != null) {
      if (forceRequest) {
        httpParams = httpParams.set('forceRequest', forceRequest.toString());
      }
    }

    if (eventType != null) {
      httpParams = httpParams.set('eventType', eventType);
    }

    if (eventSubtype != null) {
      httpParams = httpParams.set('eventSubtype', eventSubtype);
    }

    if (period != null) { httpParams = httpParams.set('period', period); }
    if (periodFilter != null) { httpParams = httpParams.set('periodFilter', periodFilter); }

    if (startDate != null) {
      startDate = this.dateService.getBeginPassedMinute(startDate);
      httpParams = httpParams.set('start', startDate.toString());
    }
    if (endDate != null) {
      endDate = this.dateService.getBeginPassedMinute(endDate);
      httpParams = httpParams.set('end', endDate.toString());
    }

    var timezone = this.dateService.getTimezone();
    if (timezone) {
      httpParams = httpParams.set('timezone', timezone);
    }

    return httpParams;
  }


}
