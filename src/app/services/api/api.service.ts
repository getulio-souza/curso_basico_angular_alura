import { AbstractService, PropertiesService } from "@alis/ng-services";
import { of } from "rxjs";
import { map, switchAll } from "rxjs/operators";


export class ApiService extends AbstractService {

  private static apiPathProperty = 'apiServer';
  private apiResourceUrl: string;
  
  constructor(
    resourceUrl: string,
    propertiesService: PropertiesService) {
      super(ApiService.apiPathProperty, propertiesService);
      this.apiResourceUrl = resourceUrl;
  }

  public getResourceUrl() {
    return this.getApiUrl().pipe(map((apiServer) => {
      return of(`${apiServer}/${this.apiResourceUrl}`)
    }), switchAll());
  }

  getPropertiesService() {
    return this.propertiesService;
  }

}
