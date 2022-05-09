import { map, switchMap } from 'rxjs/operators';
import { ProxperAuthService } from '../proxper-auth/proxper-auth.service';
import { Injectable } from '@angular/core';
import { TokenProviderService } from '@alis/ng-services';
import { Observable } from 'rxjs';


@Injectable()
export class ProxperTokenProvider implements TokenProviderService {


  constructor(private proxperAuthService: ProxperAuthService){
   
  }


  getToken(serviceId : string): Observable<string> {
    if(serviceId == 'automation'){
      return this.proxperAuthService.getAuhorizationToken().pipe(map((authorizationRes) => {
          const authToken = authorizationRes;
          if(authToken != null){
            const access_token = authToken['access_token']; 
            return access_token; 
          }
          return undefined;
      }));
    }

    return null;
  }
}