import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { OrderEvent } from '../modules/order/model/order-event';
import { OrderService } from '../services/order/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderHelperService {

  constructor(private orderService: OrderService) {
  }

  getWards(tags: string[], organizations: { id: string, name: string }[]): string[] {
    return tags.filter(tag => organizations.find(organization => organization.name == tag));
  }

  getPractitioners(tags: string[]): string[] {
    return tags.filter(tag => tag.startsWith('Practitioner')).map(tag => tag.replace('Practitioner:', ''));
  }

  filterByStartAndEndDate(eventsFiltered: OrderEvent[], dateStart: number, dateEnd: number) {
    const eventsFiltered2 = eventsFiltered.filter(event => moment(event.date).isAfter(moment(dateStart)) && moment(event.date).isBefore(moment(dateEnd)));
    return eventsFiltered2;
  }

}
