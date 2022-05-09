import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OrderEvent } from '../../modules/order/model/order-event';
import { FakeDataService } from '../fake-data/fake-data.service';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderEventMockedService {

  constructor(private http: HttpClient, private propertiesService: PropertiesService, private fakeDataService: FakeDataService,
    private orderService: OrderService, private translateService: TranslateService) { }

  getCardsList() {
    // using fake data
    return of(this.fakeDataService.getFakeEventsCard());
  }

  getEvents(eventSubType: 'CreateOrder' | 'DelayedOrder' | 'DoneOrder' | 'NotDoneOrder' | 'CanceledOrder'): Observable<OrderEvent[]> {
    return this.propertiesService.getAppConfig().pipe(switchMap(appConfig => {
      console.log(appConfig)
      return forkJoin([this.orderService.getItems(),
      this.orderService.getItemCategories(),
      this.propertiesService.readAllProperties()])
        .pipe(switchMap(forkJoinRes => {
          const items = forkJoinRes[0];
          const categories = forkJoinRes[1];

          const eventsApi = appConfig['eventsUrl'];
          const orderApi = appConfig.orders.orderApi;
          //const orderApi = "http://localhost:3000";
          return this.http.get<OrderEvent[]>(`${orderApi}/events`).pipe(switchMap(allEvents => {
            const filteredEvents = allEvents.filter(event => event.eventSubtype == eventSubType);
            const eventsWithLabel = [];
            for (let orderEvent of filteredEvents) {
              const eventWithLabel = JSON.parse(JSON.stringify(orderEvent));
              eventWithLabel.itemId = orderEvent.item;
              eventWithLabel.item = items.find(item => item.id == orderEvent.item).labels['pt'];
              eventWithLabel.category = categories.find(category => category.id == orderEvent.category).labels['pt'];
              eventsWithLabel.push(eventWithLabel);
            }
            if (eventsWithLabel.length > 0) {
              const chain: Observable<OrderEvent>[] = [];
              eventsWithLabel.forEach(event => {
                if (event.category != null) {
                  let pipe = this.translateService.get(event.category).pipe(map((categoryTranslated: string) => {
                    event.category = categoryTranslated;
                    return event;
                  }));
                  chain.push(pipe);
                }
              });
              return forkJoin(chain).pipe(map(result => {
                return result;
              }));
            } else {
              return of([]);
            }
          }));
        }));
    }))/* .catch((err, caught) => {
      console.error(err);
      return caught;
    }) */;
  }

}