import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { flatten, groupBy } from 'underscore';
import { OrderHelperService } from '../../../order/order-helper.service';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-avg-elapsed-time-by-practitioner',
  templateUrl: './avg-elapsed-time-by-practitioner.component.html',
  styleUrls: ['./avg-elapsed-time-by-practitioner.component.scss']
})
export class AvgElapsedTimeByPractitionerComponent implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: string }>

  @Input() startDate: number;
  @Input() endDate: number;

  selectedCategory: string;
  selectedSector: string;
  categories: string[];
  sectors: string[];

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLDivElement>;

  organizations: { id: string; name: string; }[];

  myChart: echarts.ECharts;
  chartLoading: boolean;

  private allLabel: string;
  private lateLabel: string;
  private targetLabel: string;

  constructor(private orderService: OrderService, private eventsMockedService: OrderEventService, private translateService: TranslateService,
    private orderHelperService: OrderHelperService) { }

  async ngOnInit() {
    // based on prepared DOM, initialize echarts instance
    this.myChart = echarts.init(this.canvas.nativeElement);

    this.organizations = await this.orderService.getItemOrganizations().toPromise();
    this.allLabel = await this.translateService.get('All').toPromise();
    this.lateLabel = await this.translateService.get('Late').toPromise();
    this.targetLabel = await this.translateService.get('Target').toPromise();

    this.pickLoopItem(null, null);
    this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: string }) => {
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.pickLoopItem(this.categories != null ? this.categories[0] : null, this.sectors != null ? this.sectors[0] : null);
    });
  }

  pickLoopItem(category: string, sector: string) {
    forkJoin(this.eventsMockedService.getEvents('DoneOrder'), this.eventsMockedService.getEvents('NotDoneOrder'), this.eventsMockedService.getEvents('CanceledOrder')).subscribe(res => {
      const doneOrderEvents = res[0];
      const notDoneOrderEvents = res[1];
      const canceledOrderEvents = res[2];

      const completeOrderEvents = [].concat(doneOrderEvents, notDoneOrderEvents, canceledOrderEvents);

      if (category != null) {
        this.selectedCategory = category;
        this.selectedSector = sector;
      } else {
        this.categories = [this.allLabel];
        this.selectedCategory = this.categories[0];
        this.categories = this.categories.concat(Array.from(new Set(flatten(completeOrderEvents.map(event => event.category)))));
        this.sectors = [this.allLabel];
        this.sectors = this.sectors.concat(Array.from(new Set(flatten(completeOrderEvents.map(event => this.orderHelperService.getWards(event.tags, this.organizations))))));
        this.selectedSector = this.sectors[0];
      }

      const completeOrderEventsFiltered = this.filterEvents(completeOrderEvents);

      const groupedBy = this.groupBy(completeOrderEventsFiltered);
      this.setupChartBar(groupedBy);

    });
  }

  private filterEvents(events: OrderEvent[]) {
    const eventsFiltered = this.selectedCategory == this.allLabel ? events : events.filter(event => event.category == this.selectedCategory);
    const eventsFiltered2 = this.selectedSector == this.allLabel ? eventsFiltered :
      eventsFiltered.filter(event => this.orderHelperService.getWards(event.tags, this.organizations).includes(this.selectedSector));
    const eventsFiltered3 = this.filterByStartAndEndDate(eventsFiltered2);
    return eventsFiltered3;
  }

  groupBy(completeOrders: OrderEvent[]): { qty: number; label: string }[] {
    const items = completeOrders.map(event => {
      let minutesDiff = moment(event.timestamp).diff(moment(event.date), 'hours');
      return {
        minutesDiff: minutesDiff,
        label: event.category + ' - ' + this.orderHelperService.getPractitioners(event.tags)
      }
    });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.label);
    const values = Object.values(grouped);
    return values.map(item => {
      let total = item.reduce((acc, itemi) => acc + itemi.minutesDiff, 0);
      let avg = total / item.length;
      return {
        qty: avg,
        label: item[0].label
      }
    });
  }

  setupChartBar(items: { qty: number; label: string }[]) {
    // specify chart configuration item and data

    const option: EChartOption = {
      color: OrderChartsConstants.COLORS,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: "{b} - {c} h"
      },
      grid: {
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: OrderChartsConstants.COLOR_FONT
          }
        },
      },
      yAxis: {
        type: 'category',
        data: items.map(item => item.label),
        axisLine: {
          lineStyle: {
            color: OrderChartsConstants.COLOR_FONT
          }
        },
      },
      series: [{
        type: 'bar',
        data: items.map(item => item.qty)
      }]
    };

    // use configuration item and data specified to show chart
    this.myChart.setOption(option);
    window.addEventListener('resize', () => this.myChart.resize());
    this.myChart.off('click');
    this.chartLoading = false;
  }

  private filterByStartAndEndDate(eventsFiltered: OrderEvent[]) {
    const dateStart = this.startDate;
    const dateEnd = this.endDate;
    const eventsFiltered2 = eventsFiltered.filter(event => moment(event.date).isAfter(moment(dateStart)) && moment(event.date).isBefore(moment(dateEnd)));
    return eventsFiltered2;
  }

}