import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Item } from '../../modules/order/model/item';
import { Order } from '../../modules/order/model/order';
import { FakeDataService } from '../fake-data/fake-data.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  externo = false;
  orderToken = null;

  constructor(private http: HttpClient, private propertiesService: PropertiesService, private fakeDataService: FakeDataService) {
  }

  getCardsList() {
    // using fake data
    return of(this.fakeDataService.getFakeEventsCard());
  }

  setExterno(token: string): void {
    this.externo = true;
    this.orderToken = token;
  }

  validateAccess(token): Observable<boolean> {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<boolean>(`${orderApi}/order/validate`,
      { headers: { 'Authorization': 'Bearer ' + token } });
    }));
  }

  getOrders(): Observable<Order[]> {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<Order[]>(`${orderApi}/order`,
        { headers: { 'Authorization': 'Bearer ' + res['ordertoken'] } });
    }));
  }

  getOrdersByStatus(status: string) {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<Order[]>(`${orderApi}/order?status=${status}`,
        { headers: { 'Authorization': 'Bearer ' + res['ordertoken'] } });
    }));
  }

  getItems(): Observable<Item[]> {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<Item[]>(`${orderApi}/item/`,
        { headers: { 'Authorization': 'Bearer ' + res['ordertoken'] } });
    }));
  }

  getItemCategories(): Observable<{ labels: any, id: string }[]> {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<any[]>(`${orderApi}/category/`,
        { headers: { 'Authorization': 'Bearer ' + res['ordertoken'] } });
    }));
  }

  getItemOrganizations(): Observable<{ id: string, name: string }[]> {
    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const restApiServer = res['orders']['whiteboardApi'];
      
      return this.http.get<{ id: string, name: string }[]>(`${restApiServer}/organization/allByTypeAndPartOf?type=WARD&partOf=5d82403f3d24e7229c7296cb`,
        { headers: { 'Authorization': 'Bearer ' + res['ordertoken'] } });
    }));
  }

  ordersFilteredForAdvancedView(status: string, category: string, sector: string, ward: string, subject: string, date: string, sla: string, rate: number) {
    const statusFilter = status ? `status=${status}&` : '';
    const categoryFilter = category ? `category=${category}&` : '';
    const sectorFilter = sector ? `sector=${sector}&` : '';
    const wardFilter = ward ? `ward=${ward}&` : '';
    const subjectFilter = subject ? `location=${subject}&` : '';
    const dateFilter = date ? `date=${date}&` : '';
    const slaFilter = sla ? `sla=${sla}&` : '';
    const rateFilter = rate ? `rate=${rate}&` : '';

    return this.propertiesService.getAppConfig().pipe(switchMap(res => {
      const orderApi = this.externo ? res['orderApi'] : res['orders']['orderApi'];

      return this.http.get<any>(`${orderApi}/order/advanced-filter?${statusFilter}${categoryFilter}${sectorFilter}${wardFilter}${subjectFilter}${dateFilter}${slaFilter}${rateFilter}`, {
        headers: {
          'Authorization': 'Bearer ' + (this.externo ? this.orderToken : res['ordertoken']) 
        }
      });
    }));
  }

  orderStatus(): Map<string, string> {
    const map = new Map<string, string>();
    map.set('Solicitado','REQUESTED');
    map.set('Em Andamento', 'IN_PROGRESS');
    map.set('A cancelar', 'TO_CANCEL');
    map.set('Cancelado', 'CANCELLED');
    map.set('Feito', 'DONE');
    map.set('Não Feito', 'NOT_DONE');

    return map;
  }

}