import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { flatten, groupBy } from 'underscore';
import { OrderHelperService } from '../../../order/order-helper.service';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-order-by-sectors-chart',
  templateUrl: './order-by-sectors-chart.component.html',
  styleUrls: ['./order-by-sectors-chart.component.scss']
})
export class OrderBySectorsChartComponent implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: string }>

  @Input() startDate: number;
  @Input() endDate: number;

  selectedItem: string;
  loopItems: string[];

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;

  organizations: { id: string; name: string; }[];

  mode: 'category' | 'organization' = 'organization';
  myChart: echarts.ECharts;
  chartLoading: boolean;

  constructor(private orderService: OrderService, private eventsService: OrderEventService, private orderHelperService: OrderHelperService) { }

  async ngOnInit() {
    // based on prepared DOM, initialize echarts instance
    this.myChart = echarts.init(this.canvas.nativeElement);

    this.organizations = await this.orderService.getItemOrganizations().toPromise();

    this.pickLoopItem(null);
    this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: string }) => {
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.pickLoopItem(this.loopItems != null ? this.loopItems[0] : null);
    });
  }

  loadCategoryChart(category: string) {
    this.eventsService.getEvents('CreateOrder').subscribe(events => {
      if (category != null) {
        this.selectedItem = category;
      } else {
        this.loopItems = Array.from(new Set(events.map(event => event.category)));
        this.selectedItem = this.loopItems[0];
      }

      const eventsFiltered = events.filter(event => event.category == this.selectedItem);

      const eventsFiltered2 = this.filterByStartAndEndDate(eventsFiltered);

      const groupedBy = this.groupByOrganization(eventsFiltered2);
      this.setupChartBar(groupedBy);
    });
  }

  pickLoopItem(loopItem: string) {
    if (this.mode == 'category') {
      this.loadCategoryChart(loopItem);
    } else if (this.mode == 'organization') {
      this.loadOrganizationChart(loopItem);
    }
  }

  groupByOrganization(events: OrderEvent[]): { qty: number; label: string }[] {
    const items = events.map(event => { return { qty: Number.parseInt(event.quantity), label: this.orderHelperService.getWards(event.tags, this.organizations) } });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.label);
    const values = Object.values(grouped);
    const groupedBy = values.map(item => {
      return {
        qty: item.length as number,
        label: item[0].label[0],
      }
    });
    return groupedBy;
  }

  setupChartBar(items: { qty: number; label: string }[]) {
    // specify chart configuration item and data

    const option = OrderChartsConstants.getPieChartOptions(items.map(item => {
      return {
        name: item.label,
        value: item.qty
      }
    }));

    // use configuration item and data specified to show chart
    this.myChart.setOption(option);

    this.myChart.off('click');
    this.chartLoading = false;
    this.myChart.on('click', (event: { name: string }) => {
      if (this.chartLoading) {
        return;
      }
      this.chartLoading = true;
      if (this.mode == 'category') {
        this.mode = 'organization';
      } else if (this.mode == 'organization') {
        this.mode = 'category';
      }
      this.loopItems = items.map(item => item.label);
      this.selectedItem = this.loopItems[0];
      this.pickLoopItem(event.name);
    });
    window.addEventListener('resize', () => this.myChart.resize());
  }

  loadOrganizationChart(organizationName: string) {
    this.eventsService.getEvents('CreateOrder').subscribe(events => {

      if (organizationName != null) {
        this.selectedItem = organizationName;
      } else {
        this.loopItems = Array.from(new Set(flatten(events.map(event => this.orderHelperService.getWards(event.tags, this.organizations)))));
        this.selectedItem = this.loopItems[0];
      }

      const eventsFiltered = events.filter(event => this.orderHelperService.getWards(event.tags, this.organizations).includes(this.selectedItem));

      const eventsFiltered2 = this.filterByStartAndEndDate(eventsFiltered);

      const groupedBy = this.groupByCategory(eventsFiltered2);
      this.setupChartBar(groupedBy);
    });
  }

  groupByCategory(events: OrderEvent[]): { qty: number; label: string }[] {
    const items = events.map(event => { return { qty: Number.parseInt(event.quantity), label: event.category } });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.label);
    const values = Object.values(grouped);
    const groupedBy = values.map(item => {
      return {
        qty: item.length,
        label: item[0].label,
      }
    });
    return groupedBy;
  }

  private filterByStartAndEndDate(eventsFiltered: OrderEvent[]) {
    const dateStart = this.startDate;
    const dateEnd = this.endDate;
    const eventsFiltered2 = eventsFiltered.filter(event => moment(event.date).isAfter(moment(dateStart)) && moment(event.date).isBefore(moment(dateEnd)));
    return eventsFiltered2;
  }

}