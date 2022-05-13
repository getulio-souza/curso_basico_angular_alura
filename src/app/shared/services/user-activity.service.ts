import { PropertiesService } from '@alis/ng-services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { UserActivity } from '../model/userActivity';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {


  constructor(
    private httpClient: HttpClient,
    private propertiesService: PropertiesService
  ) {}

  public createActivity(userActivity: UserActivity): Observable<UserActivity> {
    return this.propertiesService.readProperties("assets/appConfig.properties.json").pipe(
     flatMap((config) => 
        this.httpClient.post<UserActivity>(
          config.authServer + '/activities',
          userActivity,
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' })})));
  }

}
