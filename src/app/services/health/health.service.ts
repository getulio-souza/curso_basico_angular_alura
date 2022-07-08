import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { FakeDataService } from '../fake-data/fake-data.service';


@Injectable({
  providedIn: 'root'
})
export class HealthService extends ApiService {

  constructor(
    private http: HttpClient, 
    propertiesService: PropertiesService, 
    private fakeDataService: FakeDataService) {
      super('v1/health', propertiesService);
  }

  getItemOrganizations(): Observable<{ id: string, name: string }[]> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<{ id: string, name: string }[]>(`${apiUrl}/organization/allByTypeAndPartOf?type=WARD&partOf=5d82403f3d24e7229c7296cb`);
    }));
  }

  getPractitioner(practitionerId: string): Observable<any[]> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<any[]>(`${apiUrl}/practitioner/${practitionerId}`);
    }));
  }

}