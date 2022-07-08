import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Item } from '../../modules/order/model/item';
import { ItemCategory } from '../../modules/order/model/item-category.dto';
import { Order } from '../../modules/order/model/order';
import { ApiService } from '../api/api.service';
import { FakeDataService } from '../fake-data/fake-data.service';
import { HealthService } from '../health/health.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {

  externo = false;
  orderToken = null;

  constructor(
    private http: HttpClient, 
    propertiesService: PropertiesService, 
    private fakeDataService: FakeDataService,
    private whiteboardService: HealthService) {
      super('v1/order', propertiesService);
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
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<boolean>(`${apiUrl}/request/validate`,
      { headers: { 'Authorization': 'Bearer ' + token } });
    }));
  }

  getOrders(): Observable<Order[]> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<Order[]>(`${apiUrl}/request`);
    }));
  }

  getOrdersByStatus(status: string) {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<Order[]>(`${apiUrl}/request?status=${status}`);
    }));
  }

  getItems(): Observable<Item[]> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<Item[]>(`${apiUrl}/item`);
    }));
  }

  getItemCategories(): Observable<ItemCategory[]> {
    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<ItemCategory[]>(`${apiUrl}/category`);
    }));
  }

  getItemOrganizations(): Observable<{ id: string, name: string }[]> {
    return this.whiteboardService.getItemOrganizations();
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

    return this.getResourceUrl().pipe(switchMap((apiUrl) => {
      return this.http.get<ItemCategory[]>(`${apiUrl}/request/advanced-filter?${statusFilter}${categoryFilter}${sectorFilter}${wardFilter}${subjectFilter}${dateFilter}${slaFilter}${rateFilter}`);
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