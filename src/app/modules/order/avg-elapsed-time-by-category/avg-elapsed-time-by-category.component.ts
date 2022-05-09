import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { flatten, groupBy } from 'underscore';
import { OrderHelperService } from '../../../order/order-helper.service';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-avg-elapsed-time-by-category',
  templateUrl: './avg-elapsed-time-by-category.component.html',
  styleUrls: ['./avg-elapsed-time-by-category.component.scss']
})
export class AvgElapsedTimeByCategoryComponent implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: 'hour' | 'day' | 'month' }>

  @Input() startDate: number;
  @Input() endDate: number;
  @Input() resolution: 'hour' | 'day' | 'month';

  sectors: string[];
  selectedSector: string;

  categories: string[];

  avgs: { key: string; value: string; }[];

  allLabel: string;
  organizations: { id: string; name: string; }[];

  constructor(private orderHelperService: OrderHelperService, private orderService: OrderService, private eventsService: OrderEventService, private translateService: TranslateService) { }

  async ngOnInit() {
    this.allLabel = await this.translateService.get('All').toPromise();
    this.organizations = await this.orderService.getItemOrganizations().toPromise();

    this.pickLoopItem(this.selectedSector);

    this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: 'hour' | 'day' | 'month' }) => {
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.resolution = dates.resolution;
      this.pickLoopItem(this.selectedSector);
    });

    moment.locale(this.translateService.currentLang);
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      moment.locale(event.lang);
    });

  };

  pickLoopItem(sector: string) {
    forkJoin(this.eventsService.getEvents('DoneOrder'), this.eventsService.getEvents('NotDoneOrder'), this.eventsService.getEvents('CanceledOrder')).subscribe(res => {
      const doneOrderEvents = res[0];
      const notDoneOrderEvents = res[1];
      const canceledOrderEvents = res[2];

      const completedOrderEvents = [].concat(doneOrderEvents, notDoneOrderEvents, canceledOrderEvents);

      if (sector == null) {
        this.sectors = [this.allLabel];
        this.sectors = this.sectors.concat(Array.from(new Set(flatten(completedOrderEvents.map(event => this.orderHelperService.getWards(event.tags, this.organizations))))));
        this.selectedSector = this.sectors[0];
        this.categories = Array.from(new Set(flatten(completedOrderEvents.map(event => event.category))));
      } else {
        this.selectedSector = sector;
      }

      const eventsFiltered = this.orderHelperService.filterByStartAndEndDate(completedOrderEvents, this.startDate, this.endDate);
      const eventsFiltered2 = this.selectedSector ==
        this.allLabel ? eventsFiltered : eventsFiltered.filter(event => this.orderHelperService.getWards(event.tags, this.organizations).includes(this.selectedSector));

      const eventsGroupedByCategory = groupBy(eventsFiltered2, event => event.category);
      this.avgs = this.categories.map(category => {
        if (Object.keys(eventsGroupedByCategory).includes(category)) {
          let total = eventsGroupedByCategory[category].reduce((acc, val) => {
            return acc += this.getOrderDuration(val);
          }, 0);
          let avg = total / eventsGroupedByCategory[category].length;
          return {
            key: category,
            value: this.formatValue(avg)
          };
        } else {
          return {
            key: category,
            value: 'N/A'
          };
        }
      });
    });
  }

  getOrderDuration(event: OrderEvent): number {
    const close = moment(event.timestamp);
    const open = moment(event.date);
    return close.diff(open, 'ms');
  }

  formatValue(ms: number): string {
    const duration = moment.duration(ms, 'ms');
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const a = (hours != 0 ? hours + ':' : '') + (minutes + '').padStart(2, '0')
    return (years != 0 ? years + ' ' + this.translateService.instant('Years') + ' ' : '') +
      (months != 0 ? months + ' ' + this.translateService.instant('Months') + ' ' : '') +
      (days != 0 ? days + ' ' + this.translateService.instant('Days') + ' ' : '') +
      (hours + '').padStart(2, '0') + ':' +
      (minutes + '').padStart(2, '0');
  }

  getBackgroundColor(): string[] {
    return OrderChartsConstants.COLORS;
  }

}