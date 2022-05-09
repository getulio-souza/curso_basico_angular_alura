import { PropertiesService } from '@alis/ng-services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserActivity } from '../model/userActivity';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {


  constructor(
    private httpClient: HttpClient,
  ) {}

  public createActivity(userActivity: UserActivity): Observable<UserActivity> {
    return this.httpClient.post<UserActivity>(
      PropertiesService.properties.authServer + '/activities',
      userActivity,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

}
