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
export class AssetsService extends ApiService {

  constructor(
    private http: HttpClient, 
    propertiesService: PropertiesService) {
      super('v1/assets', propertiesService);
  }

  /**
   * Deve morrer no futuro, o endpoint /user/me irá para o authorization
   * 
   * @returns Observable<any>
   */
  getUser(): Observable<any> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<any[]>(`${apiUrl}/whiteboard/user/me`);
    }));
  }

}