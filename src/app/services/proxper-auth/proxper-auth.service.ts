import { ContextService } from '../context/context.service';
import { map, switchAll, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AbstractService, PropertiesService } from '@alis/ng-services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProxperAuthService extends AbstractService {

  
  private static apiPathProperty = 'proxperAuthUrl';

  propertiesServiceLocal: PropertiesService;

  constructor(
    propertiesService: PropertiesService) {
    super(ProxperAuthService.apiPathProperty, propertiesService);
    
    this.propertiesServiceLocal = propertiesService;
  }

  getAuhorizationToken(): Observable<{access_token: string}>{
    return of({access_token: localStorage.getItem('access_token')});
  }

}
