import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NPSEvent } from '../modules/nps/model/nps-event';

@Injectable({
  providedIn: 'root'
})
export class NPSHelperService {

  constructor() {
  }

  getWards(tags: string[], organizations: { id: string, name: string }[]): string[] {
    return tags.filter(tag => organizations.find(organization => organization.name == tag));
  }

  getPractitioners(tags: string[]): string[] {
    return tags.filter(tag => tag.startsWith('Practitioner')).map(tag => tag.replace('Practitioner:', ''));
  }

  filterByStartAndEndDate(eventsFiltered: NPSEvent[], dateStart: number, dateEnd: number) {
    const eventsFiltered2 = eventsFiltered.filter(event => moment(event.date).isAfter(moment(dateStart)) && moment(event.date).isBefore(moment(dateEnd)));
    return eventsFiltered2;
  }

}
