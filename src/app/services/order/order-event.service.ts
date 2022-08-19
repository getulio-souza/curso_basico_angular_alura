import { OrderCategoriesWardsSubjectsAndSectorsDTO } from '../../modules/order/model/order-categories-wards-and-subjects.dto';
import { PropertiesService } from '@alis/ng-services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {  Observable, of, Subject } from 'rxjs';
import { map, debounceTime, tap } from 'rxjs/operators';
import { OrderWardQuantityDTO } from '../../modules/order/model/ordar-ward-quantity.dto';
import { OrderCategoryQuantityDTO } from '../../modules/order/model/order-category-quantity.dto';
import { OrderEvent } from '../../modules/order/model/order-event';
import { FakeDataService } from '../fake-data/fake-data.service';
import { Router } from '@angular/router';
import { EventService } from '../event/event.service';
import { ApiService } from '../api/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService  {
  private createOrderSubject: Subject<OrderEvent[]> = new Subject();
  private delayedOrderSubject: Subject<OrderEvent[]> = new Subject();
  private estimateOrderSubject: Subject<OrderEvent[]> = new Subject();
  private handleOrderSubject: Subject<OrderEvent[]> = new Subject();
  private cancelOrderSubject: Subject<OrderEvent[]> = new Subject();
  private doneOrderSubject: Subject<OrderEvent[]> = new Subject();
  private notDoneOrderSubject: Subject<OrderEvent[]> = new Subject();
  private canceledOrderSubject: Subject<OrderEvent[]> = new Subject();
  private assignOrderSubject: Subject<OrderEvent[]> = new Subject();

  private propertyId: string;
  private apiServer: string;

  private externo = false;

  constructor(
    private http: HttpClient,
    private propertiesService: PropertiesService,
    private fakeDataService: FakeDataService, 
    private translateService: TranslateService, 
    private eventService: EventService,
    private router: Router) {
      this.router.events.pipe(debounceTime(50)).subscribe((_) => {
        this.getProperties();
      });
      this.propertiesService.readProperties("assets/appConfig.properties.json").pipe(
        tap((config) => {
          this.apiServer = config.apiServer
        })
      ).subscribe();
  }

  async getProperties(): Promise<void> {
      const response = await this.propertiesService.getAppConfig().toPromise();
      if (!this.externo) {
        this.propertyId = response.propertyId;
      }
      const properties = await this.propertiesService.readProperties("assets/appConfig.properties.json").toPromise();
      let proxperConfigsUrl = properties['apiServer'];
      if (proxperConfigsUrl == null) {
        console.error("Could not find 'apiServer' in properties file");
      }
     return proxperConfigsUrl;
  }

  setPropertyId(property: string): void {
    this.externo = true;
    this.propertyId = property;
  }

  getCardsList() {
    // using fake data
    return of(this.fakeDataService.getFakeEventsCard());
  }

  getEvents(eventSubType: 'CreateOrder' | 'DelayedOrder' | 'EstimateOrder' | 'HandleOrder' | 'CancelOrder' | 'DoneOrder' | 'NotDoneOrder' | 'CanceledOrder' | 'AssignOrder'): Observable<OrderEvent[]> {
    return this.http.get<OrderEvent[]>(`${this.apiServer}/event/source/${this.propertyId}/OrderEventKafkaProducer?eventType=OrderEvent&eventSubtype=${eventSubType}`);
  }

  translateEventsCategory(events: OrderEvent[]): OrderEvent[] {
    const translationConsummer = (string: string) => {
      let translation = string;
      this.translateService.get(string).subscribe(response => {
        translation = response ? response : translation;
      });

      return translation;
    }

    return events.map(event => Object.assign({}, {...event, category: translationConsummer(event.category) }));;
  }

  // CreateOrder
  getCreateOrderObservable(): Observable<OrderEvent[]> {
    return this.createOrderSubject.asObservable();
  }

  async createOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): Promise<void> {
    this.getEvents('CreateOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.createOrderSubject.next(response.filter(orderEvent => {
        if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // DelayedOrder
  getDelayedOrderObservable(): Observable<OrderEvent[]> {
    return this.delayedOrderSubject.asObservable();
  }

  delayedOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('DelayedOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.delayedOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // EstimateOrder
  getEstimateOrderObservable(): Observable<OrderEvent[]> {
    return this.estimateOrderSubject.asObservable();
  }

  estimateOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('EstimateOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.estimateOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // HandleOrder
  getHandleOrderObservable(): Observable<OrderEvent[]> {
    return this.handleOrderSubject.asObservable();
  }

  handleOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('HandleOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.handleOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // CancelOrder
  getCancelOrderObservable(): Observable<OrderEvent[]> {
    return this.cancelOrderSubject.asObservable();
  }

  cancelOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('CancelOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.cancelOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // DoneOrder
  getDoneOrderObservable(): Observable<OrderEvent[]> {
    return this.doneOrderSubject.asObservable();
  }

  doneOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('DoneOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.doneOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // NotDoneOrder
  getNotDoneOrderObservable(): Observable<OrderEvent[]> {
    return this.notDoneOrderSubject.asObservable();
  }

  notDoneOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('NotDoneOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.notDoneOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // CanceledOrder
  getCanceledOrderObservable(): Observable<OrderEvent[]> {
    return this.canceledOrderSubject.asObservable();
  }

  canceledOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('CanceledOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.canceledOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // AssignOrder
  getAssignOrderObservable(): Observable<OrderEvent[]> {
    return this.assignOrderSubject.asObservable();
  }

  assignOrderItemsStatisticsBetweenDates(initialDate: Date, finalDate: Date, category: string): void {
    this.getEvents('AssignOrder')
    .pipe(map(response => response.map(orderEvent => Object.assign({}, {...orderEvent, labels: new Map(Object.entries(orderEvent.labels))}))))
    .subscribe((response: OrderEvent[]) => {
      this.assignOrderSubject.next(response.filter(orderEvent => {
         if (new Date(orderEvent.eventDate) >= initialDate && new Date(orderEvent.eventDate) <= finalDate
          && (orderEvent.category === category || !category)) {
            return true;
        }
        return false;
      }));
    });
  }

  // NEW ORDER CONTROLLER
  findEventsCategoriesOpennedAtHalfhour(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderCategoryQuantityDTO[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderCategoryQuantityDTO[]>(`${this.apiServer}/v1/events/order/categories-half/${this.propertyId}?${params}`);
  }

  findEventsOpennedAtHalfhour(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderEvent[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderEvent[]>(`${this.apiServer}/v1/events/order/orders-half/${this.propertyId}?${params}`);
  }

  topFiveCategoriesWithOpennedOrders(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderCategoryQuantityDTO[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderCategoryQuantityDTO[]>(`${this.apiServer}/v1/events/order/openned-top-categories/${this.propertyId}?${params}`);
  }

  topFiveWardsAndOppenedOrdersQuantity(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderWardQuantityDTO[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderWardQuantityDTO[]>(`${this.apiServer}/v1/events/order/openned-top-wards/${this.propertyId}?${params}`);
  }

  findEventsOpennedOrders(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderEvent[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderEvent[]>(`${this.apiServer}/v1/events/order/openned-itens/${this.propertyId}?${params}`);
  }

  topFiveCategoriesWithDelayedOrders(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderCategoryQuantityDTO[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderCategoryQuantityDTO[]>(`${this.apiServer}/v1/events/order/delayed-top-categories/${this.propertyId}?${params}`);
  }

  findEventsDelayed(ward: string, category: string, subject: string, start: number, end: number): Observable<OrderEvent[]> {
    const wardParam = ward ? `ward=${ward}` : '';
    const categoryParam = category ? `category=${category}` : '';
    const subjectParam = subject ? `subject=${subject}` : '';
    const startTime = start ? `start=${start}` : '';
    const endTime = end ? `end=${end}` : '';

    const params = `${wardParam}&${categoryParam}&${subjectParam}&${startTime}&${endTime}`;

    return this.http.get<OrderEvent[]>(`${this.apiServer}/v1/events/order/delayed-itens/${this.propertyId}?${params}`);
  }

  getCategoriesAndSubjects(propertyId: string): Observable<OrderCategoriesWardsSubjectsAndSectorsDTO> {
    return this.http.get<OrderCategoriesWardsSubjectsAndSectorsDTO>(`${this.apiServer}/v1/events/order/categories-subjects/${propertyId}`);
    
  }

  getSubjectsByWard(ward: string, propertyId: string): Observable<OrderCategoriesWardsSubjectsAndSectorsDTO> {
    return this.http.get<OrderCategoriesWardsSubjectsAndSectorsDTO>(`${this.apiServer}/v1/events/order/subjects/${propertyId}/${ward}`);
    
  }
}
