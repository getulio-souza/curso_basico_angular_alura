import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { flatten, groupBy } from 'underscore';
import { OrderHelperService } from '../../../order/order-helper.service';
import { DateService } from '../../../services/date/date.service';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-order-qty-chart-by-days',
  templateUrl: './order-qty-chart-by-days.component.html',
  styleUrls: ['./order-qty-chart-by-days.component.scss']
})
export class OrderQtyChartByDaysComponent implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: 'hour' | 'day' | 'month' }>

  @Input() startDate: number;
  @Input() endDate: number;
  @Input() resolution: 'hour' | 'day' | 'month';

  selectedCategory: string;
  selectedSector: string;
  categories: string[];
  sectors: string[];

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLDivElement>;

  organizations: { id: string; name: string; }[];

  myChart: echarts.ECharts;
  chartLoading: boolean;

  private allLabel: string;

  constructor(private orderService: OrderService, private eventsService: OrderEventService, private translateService: TranslateService, private dateService: DateService,
    private orderHelperService: OrderHelperService) { }

  ngOnInit() {
    // based on prepared DOM, initialize echarts instance
    this.myChart = echarts.init(this.canvas.nativeElement);

    forkJoin([this.orderService.getItemOrganizations(), this.translateService.get('All')]).subscribe(res => {
      this.organizations = res[0];
      this.allLabel = res[1];

      this.pickLoopItem(null, null);
      this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: 'hour' | 'day' | 'month' }) => {
        this.startDate = dates.startDate;
        this.endDate = dates.endDate;
        this.resolution = dates.resolution;
        this.pickLoopItem(this.categories != null ? this.categories[0] : null, this.sectors != null ? this.sectors[0] : null);
      });
    })
  }

  pickLoopItem(category: string, sector: string) {
    this.eventsService.getEvents('CreateOrder').subscribe(createOrderEvents => {

      if (category != null && sector != null) {
        this.selectedCategory = category;
        this.selectedSector = sector;
      } else {
        this.categories = [this.allLabel];
        this.selectedCategory = this.categories[0];
        this.categories = this.categories.concat(Array.from(new Set(flatten(createOrderEvents.map(event => event.category)))));
        this.sectors = [this.allLabel];
        this.sectors = this.sectors.concat(Array.from(new Set(flatten(createOrderEvents.map(event => this.orderHelperService.getWards(event.tags, this.organizations))))));
        this.selectedSector = this.sectors[0];
      }

      const createOrderEventsFiltered = this.filterEvents(createOrderEvents);

      const groupedBy = this.groupBy(createOrderEventsFiltered);
      const withZeroDaysAdded = this.addZeroDays(groupedBy);

      this.setupChartBar(withZeroDaysAdded);
    });
  }

  addZeroDays(items: { value: number; name: string; }[]): { value: number; name: string; }[] {
    const beginOfCurrentPeriod = this.dateService.getBeginAndEndOfPeriod(this.startDate, this.resolution);
    const begin = moment(beginOfCurrentPeriod.begin);

    const endOfCurrentPeriod = this.dateService.getBeginAndEndOfPeriod(this.endDate, this.resolution);
    const end = moment(endOfCurrentPeriod.end);
    const steps: string[] = [];
    while (begin.isBefore(end)) {
      steps.push(begin.format(this.getDateFormat()));
      if (this.resolution == 'hour') {
        begin.add(1, 'hour');
      } else if (this.resolution == 'day') {
        begin.add(1, 'day');
      } else if (this.resolution == 'month') {
        begin.add(1, 'month');
      }
    }
    return steps.map(step => {
      const item = items.find(item => item.name == step);
      return {
        value: item != null ? item.value : 0,
        name: step
      }
    });
  }
  getDateFormat(): string {
    if (this.resolution == 'hour') {
      return 'HH:00';
    } else if (this.resolution == 'day') {
      return 'DD/MM';
    } else if (this.resolution == 'month') {
      return 'MM';
    }
  }

  private filterEvents(events: OrderEvent[]) {
    const eventsFiltered = this.selectedCategory == this.allLabel ? events : events.filter(event => event.category == this.selectedCategory);
    const eventsFiltered2 = this.selectedSector == this.allLabel ? eventsFiltered :
      eventsFiltered.filter(event => this.orderHelperService.getWards(event.tags, this.organizations).includes(this.selectedSector));
    const eventsFiltered3 = this.orderHelperService.filterByStartAndEndDate(eventsFiltered2, this.startDate, this.endDate);
    return eventsFiltered3;
  }

  groupBy(createOrderEvents: OrderEvent[]): { value: number; name: string }[] {
    const items = createOrderEvents.map(event => {
      return {
        value: Number.parseInt(event.quantity),
        name: moment(event.date).format(this.getDateFormat())
      }
    });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.name);
    const values = Object.values(grouped);

    return values.map(item => {
      return {
        value: item.reduce((acc, item) => acc += 1, 0) as number,
        name: item[0].name
      }
    });
  }

  setupChartBar(items: { name: string, value: number }[]) {
    // specify chart configuration item and data

    const option = OrderChartsConstants.getBarChartOptions(items);

    // use configuration item and data specified to show chart
    this.myChart.setOption(option);
    window.addEventListener('resize', () => this.myChart.resize());
    this.myChart.off('click');
    this.chartLoading = false;
  }

}