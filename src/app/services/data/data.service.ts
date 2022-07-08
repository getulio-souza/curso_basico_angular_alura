import { ContextService } from '../context/context.service';
import { PropertiesService } from '@alis/ng-services';
import { map, switchAll, share, finalize } from 'rxjs/operators';
import { DateService } from './../date/date.service';
import { Injectable } from '@angular/core';
import { Consumption, Presence } from '@alis/proxper-base';
import { FakeDataService } from './../fake-data/fake-data.service';
import { AbstractService } from '@alis/ng-services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

class TraceApiParams {
  traceType: string;
  start: string;
  end: string;
  period: string;
  periodFilter: string;
  timezone: string;
  minTimestamp: string;
}

export enum PeriodEnum {
  HOUR_OF_DAY = 'HOUR_OF_DAY',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  DAY_OF_MONTH = 'DAY_OF_MONTH',
  DAY_OF_YEAR = 'DAY_OF_YEAR',
  WEEK_OF_MONTH = 'WEEK_OF_MONTH',
  WEEK_OF_YEAR = 'WEEK_OF_YEAR',
  MONTH_OF_YEAR = 'MONTH_OF_YEAR'
}

export enum TraceType {
  EMS = 'tko_thermostat_norm',
  TKO_THERMOSTAT = 'tko_thermostat',
  THERMOSTAT = 'thermostat',
  LEVEL = 'level',
  PROPERTY = 'tko_property',
  DND_MUR = 'dndmur',
  DND_MUR_NORM = 'dndmur_normalized',
  RELAY = 'relay',
  RELAY_NORM = 'relay_normalized',
  POWERMETER = 'powermeter',
  POWERMETER_NORM = 'powermeter_normalized',
  PROPERTY_STATE = 'deltix_property',
  PROPERTY_STATE_NORMALIZED = 'deltix_property_normalized',
  PRESENCE_SENSOR = 'occupancysensor',
  PRESENCE_SENSOR_NORM = 'occupancysensor_normalized',
  DOOR_SENSOR = 'doorsensor',
  LOCK = 'lock',
  MDUUnit = 'mduunit',
  WATERMETER = 'watermeter',
  CHILLER = 'chiller',
  THERMOMETER = 'thermometer',
  CHILLER_NORM = 'chiller_normalized',
  THERMOMETER_NORM = 'thermometer_normalized',
  ADVANCED_COLD_CHAMBER= 'advancedcoldchamber',
  ADVANCED_COLD_CHAMBER_NORM= 'advancedcoldchamber_normalized',
  DEVICE_STATUS = 'device_status',
  PROPERTY_STATUS = 'property_status',
  UNIT = 'property_unit',
  UNIT_NORM = 'propertyunit_normalized',
  HYGROMETER = 'hygrometer',
  COLD_CHAMBER = 'coldchamber',
  WATTMETER = 'wattmeter'
}

@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {

  constructor(
    propertiesService: PropertiesService,
    private http: HttpClient,
    private dateService: DateService,
    private contextService: ContextService) {

    super('v1/tracking', propertiesService);

  }

  getReportByDeviceId(
    deviceId: string,
    traceType: TraceType,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodFilter: number,
    body,
    forceRequest)
    {
     return this.getResourceUrl().pipe(map((apiUrl) => {
        let url = this.buildReportDeviceUrl(apiUrl, deviceId, resolution);
        const params = this.buildHttpParams(traceType, startDate, endDate,period, null, periodFilter,forceRequest);
        const cacheId = url + traceType;
        return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params }));
      }), switchAll());
    }

  latestTraceByTypeOwnerAndTag(traceType, propertyId, tag, body, minTimestamp?, forceRequest?) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = this.buildReportTagUrl(apiUrl, propertyId, tag, 'latest');
      const params = this.buildHttpParams(traceType, null, null, null, null, minTimestamp, forceRequest);
      const cacheId = url + traceType;
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params }));
    }), switchAll());
  }

  getActiveConsumptionReport(
    ownerId: string,
    tag: string,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string) {

    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, ownerId, tag, resolution);
      const body = {};

      body['activeEnergy'] = 'SUM';
      body['reactiveEnergy'] = 'SUM';
      body['reactiveEnergyType'] = 'ENUM';
      body['period'] = 'ENUM';

      const params = this.buildHttpParams(TraceType.POWERMETER_NORM, startDate, endDate, period, periodEntries, null, null);

      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params })).pipe(
        map(res => this.getActiveConsumptionBuckets(res)));
    }), switchAll());

  }


  getEmsAggregation(traceType: TraceType, propertyId: string, tag: string, start, end, forceRequest) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, propertyId, tag, 'all');
      const body = {};
      body['kwh'] = 'SUM';
      body['savingsKwh'] = 'SUM';
      body['runtime'] = 'SUM';
      body['savings'] = 'SUM';
      body['presence-time'] = 'SUM';
      body['elapsedTime'] = 'SUM';
      body['active-profile.1'] = 'SUM';
      body['active-profile.2'] = 'SUM';
      body['thermostat-count'] = 'SUM';

      const startDate = start;
      const endDate = end;

      let config = this.buildHttpParams(traceType, startDate, endDate, null, null, null, forceRequest);
      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: config })).pipe(
        map(res => {
          // its /tag /all MUST return only one bucket
          return res[0];
        }));
    }), switchAll());
  }

  /**
   * Retrieves the last trace of device given its ID
   *
   * @param deviceId the ID of the device
   * @param traceType an optional parameter to specify that only a specific kind of trace can be returned
   */
  getLastTraceByDevice(deviceId, traceType, forceRequest?) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildTraceDeviceUrl(apiUrl, deviceId);
      const config = {};
      if (traceType) {
        config['params'] = { 'traceType': traceType };
      }

      if (forceRequest) {config['params']['forceRequest'] = forceRequest; }

      const cacheId = url + traceType
      return this.contextService.getRequestObservable(cacheId, this.http.get(url, config)).pipe(
        map(res => {
          return res;
        }));

    }), switchAll());
  }


  getTracesByOwnerAndTag(owner: string, tag: string, traceType, start, end, forceRequest?: boolean) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = apiUrl + '/trace/tag';

      const config = {};
      config['params'] = {};

      if (owner) { config['params']['ownerName'] = owner; }
      if (tag) { config['params']['tag'] = tag; }
      if (traceType) { config['params']['traceType'] = traceType; }
      if (start) { config['params']['start'] = start; }
      if (end) { config['params']['end'] = end; }
      if (end) { config['params']['end'] = end; }
      if (forceRequest) {config['params']['forceRequest'] = forceRequest; }

      const cacheId = url + tag + traceType;  
      return this.contextService.getRequestObservable(cacheId, this.http.get(url, config));

    }), switchAll());
  
  }


  /**
 * Loads the most current traces by owner and tag
 * @param ownerId the ownerId
 * @param tag the tag
 * @param traceType an optional parameter to specify that only a specific kind of trace can be returned
 */
  getLastTraceByTagAndOwner(ownerId: string, tag: string, traceType, forceRequest?: boolean) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = this.buildTraceTagUrl(apiUrl, ownerId, tag)


      const config = {};
      config['params'] = {};

      if (traceType) {
        config['params']['traceType'] = traceType;
      }

      if (forceRequest) {
        config['params']['forceRequest'] = forceRequest;
      }


      const cacheId = url + traceType;
      return this.contextService.getRequestObservable(cacheId, this.http.get(url, config));

    }), switchAll());
  }


  /**
  * @param ownerId - the ownerId
  * @param resolution time resolution like 'month', 'day', 'hour, 'month' or 'year'
  * @param StartDate the start date in ms
  * @param endDate the end date in ms
  * @param period if null (default) will not be period data. Can also be 'Period.HOUR_OF_DAY
  * @param periodEntries The period entries. null(default) will get everything. '2,3,4' will get Tuesday,Wednesday and Thursday
  * @returns Presence List of type Presence
  */
  getConsumptionList(
    ownerId: string,
    tag: string,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string) {

    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, ownerId, tag, resolution);
      const body = {};
      body['kwh'] = 'SUM';
      body['savingsKwh'] = 'SUM';
      const params = this.buildHttpParams(TraceType.EMS, startDate, endDate, period, periodEntries, null, null);

      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params })).pipe(
        map(res => this.getConsumptionBuckets(res)));
    }), switchAll());


  }
  /**
  * @param ownerId - the ownerId
  * @param resolution time resolution like 'month', 'day', 'hour, 'month' or 'year'
  * @param StartDate the start date in ms
  * @param endDate the end date in ms
  * @param period if null (default) will not be period data. Can also be 'Period.HOUR_OF_DAY
  * @param periodEntries The period entries. null(default) will get everything. '2,3,4' will get Tuesday,Wednesday and Thursday
  * @returns Presence List of type Presence
  */
  getOccupancyList(ownerId: string, tag: string,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string) {

    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, ownerId, tag, resolution);
      const body = {};
      body['presenceTime'] = 'SUM';
      body['elapsedTime'] = 'SUM';
      body['active-profile'] = 'ENUM';
      const params = this.buildHttpParams(TraceType.EMS, startDate, endDate, period, periodEntries, null, null);

      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params })).pipe(
        map(res => this.getPresenceBuckets(res)));
    }), switchAll());


  }

  /**
* @param ownerId - the ownerId
* @param resolution time resolution like 'month', 'day', 'hour, 'month' or 'year'
* @param StartDate the start date in ms
* @param endDate the end date in ms
* @param period if null (default) will not be period data. Can also be 'Period.HOUR_OF_DAY
* @param periodEntries The period entries. null(default) will get everything. '2,3,4' will get Tuesday,Wednesday and Thursday
* @returns a list with occupancy and consumption data
*/
  getOccupancyAndConsumptionList(
    ownerId: string,
    tag: string,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string) {

    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, ownerId, tag, resolution);
      const body = {};
      body['presence-time'] = 'SUM';
      body['elapsedTime'] = 'SUM';
      body['active-profile.1'] = 'SUM';
      body['active-profile.2'] = 'SUM';
      body['kwh'] = 'SUM';
      body['savingsKwh'] = 'SUM';
      body['thermostat-count'] = 'SUM';
      body['runtime'] = 'SUM';

      const params = this.buildHttpParams(TraceType.PROPERTY, startDate, endDate, period, periodEntries, null, null);

      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params })).pipe(
        map(res => this.getOccupancyAndConsumptioBuckets(res)));
    }), switchAll());

  }

  getReportByOwnerAndTag(
    ownerId: string,
    tag: string,
    resolution: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string,
    body: any,
    traceType: TraceType
  ) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      const url = this.buildReportTagUrl(apiUrl, ownerId, tag, resolution);

      const params = this.buildHttpParams(traceType, startDate, endDate, period, periodEntries, null, null);

      const cacheId = url + JSON.stringify(body);
      return this.contextService.getRequestObservable(cacheId, this.http.post(url, body, { params: params })).pipe(
        map(res => res));
    }), switchAll());

  }

  /**
   * List devices that sent data recently.
   * @param owner onwer (opcional)
   * @param traceType traceType (opcional)
   * @param deviceId deviceId (opcional)
   * @param tag tag (opcional)
   */
  getRecentTracesByOwnerAndTraceType(owner, traceType, deviceId, tag) {
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = apiUrl + '/trace/recentTraces';

      //lets build httpParams
      let httpParams = new HttpParams();
      if (owner != null) { httpParams = httpParams.set('owner', owner); }
      if (traceType != null) { httpParams = httpParams.set('traceType', traceType); }
      if (deviceId != null) { httpParams = httpParams.set('deviceId', deviceId); }
      if (tag != null) { httpParams = httpParams.set('tag', tag); }

      const cacheId = url;
      return this.contextService.getRequestObservable(cacheId, this.http.get(url, { params: httpParams }));
    }), switchAll());

  }


  private buildReportTagUrl(apiUrl, ownerId, tag, resolution) {
    return apiUrl + '/report/tag/' + ownerId + '/' + tag + '/' + resolution;
  }
  private buildReportDeviceUrl(apiUrl, deviceId, resolution) {
    return apiUrl + '/report/device/' + deviceId + "/" + resolution;
  }
  private buildTraceDeviceUrl(apiUrl, deviceId) {
    return apiUrl + '/trace/device/' + deviceId;
  }

  private buildTraceTagUrl(apiUrl, owner, tag) {
    return apiUrl + '/trace/tag/' + owner + "/" + tag;
  }

  private buildHttpParams(
    traceType: string,
    startDate: number,
    endDate: number,
    period: string,
    periodEntries: string,
    minTimestamp: number,
    forceRequest: boolean) {

    let httpParams = new HttpParams();

    if (traceType != null) {
      httpParams = httpParams.set('traceType', traceType);
    }

    if (period != null) { httpParams = httpParams.set('period', period); }
    if (periodEntries != null) { httpParams = httpParams.set('periodFilter', periodEntries); }
    if (forceRequest != null) {
      if (forceRequest) {
        httpParams = httpParams.set('forceRequest', forceRequest.toString());
      }
    }

    if (minTimestamp != null) {
      minTimestamp = this.dateService.getBeginPassedMinute(minTimestamp);
      httpParams = httpParams.set('minTimestamp', minTimestamp.toString());
    }

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


  private getPresenceBuckets(aggregations) {
    const presences = [];

    aggregations.forEach(bucket => {
      const presence = new Presence();

      presence.key = bucket['date'];
      presence.presenceTime = bucket['presence-time'];
      presence.elapsedTime = bucket['elapsedTime'];

      presence.soldPercentage = this.calculateSoldPercentage(bucket);

      presences.push(presence);
    });
    return presences;
  }

  private getConsumptionBuckets(aggregations) {
    const consumptions = [];

    aggregations.forEach(aggregateValue => {
      const consumption = new Consumption();
      consumption.key = aggregateValue['date'];
      consumption.kwh = aggregateValue['kwh'];
      consumption.savingsKwh = aggregateValue['savingsKwh'];

      consumptions.push(consumption);
    });

    return consumptions;
  }

  private getActiveConsumptionBuckets(aggregations) {
    const activeEnergyList = [];

    aggregations.forEach(aggregateValue => {
      const consumption = {};
      consumption['key'] = aggregateValue['date'];
      consumption['activeEnergy'] = aggregateValue['activeEnergy'];

      activeEnergyList.push(consumption);
    });

    return activeEnergyList;
  }

  private getOccupancyAndConsumptioBuckets(aggregations) {

    const summaryList = [];

    aggregations.forEach(aggregation => {
      const summary = {};

      // FIXME as we know data is being sent every hour
      // we are using 1h*thermostats count
      const totalElapsedTime = 60 * 60 * 1000 * aggregation['thermostat-count'];

      summary["key"] = aggregation['date'];

      //presence
      summary["presenceTime"] = aggregation['presence-time'] ? aggregation['presence-time'] : 0;
      summary["elapsedTime"] = totalElapsedTime ? totalElapsedTime : 0;

      //energy
      summary["kwh"] = aggregation['kwh'] ? aggregation['kwh'] : 0;
      summary["savingsKwh"] = aggregation['savingsKwh'] ? aggregation['savingsKwh'] : 0;
      summary["runtime"] = aggregation['runtime'] ? aggregation['runtime'] : 0;
      summary["soldPercentage"] = this.calculateSoldPercentage(aggregation);


      summaryList.push(summary);
    });
    return summaryList;

  }


  public calculateSoldPercentage(aggregation) {
    // 1.0 is profile SOLD
    // anything else is UNSOLD
    //FIXME - USE CONFIG
    // we could have another active-profile types depending on property (?)
    const soldTime = aggregation['active-profile.1'];
    const unSoldtime = aggregation['active-profile.2'];

    const soldPercentage = Math.round(100 * (soldTime) / (soldTime + unSoldtime));

    return soldPercentage;
  }

  getDevicesStateByOwnerAndTraceType(owner: string, traceType: TraceType){
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = apiUrl + '/state/device';
      url+= "/" + owner + "/" + traceType;

      const cacheId = url;
      return this.contextService.getRequestObservable(cacheId, this.http.get(url));
    }), switchAll());
  }

  getStateByOwnerTraceTypeAndDeviceId(owner: string, traceType: TraceType, deviceId: string, forceRequest?: boolean){
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = apiUrl + '/state/device';
      url+= "/" + owner + "/" + traceType + "/" + deviceId;

      const config = {};
      if (forceRequest) {
        config['params'] = { 'forceRequest': forceRequest };
      }


      const cacheId = url;
      return this.contextService.getRequestObservable(cacheId, this.http.get(url,config));
    }), switchAll());
  }

  getStatesByOwnerAndTagAndTraceType(owner: string, tag: string, traceType: TraceType,forceRequest?:boolean){
    return this.getResourceUrl().pipe(map((apiUrl) => {
      let url = apiUrl + '/state/tag';
      url+= "/" + owner + "/" + tag + "/" + traceType;

      const config = {}
      if (forceRequest) {
        config['params'] = { 'forceRequest': forceRequest };
      }

      const cacheId = url;
      return this.contextService.getRequestObservable(cacheId, this.http.get(url,config));
    }), switchAll());
  }

}
