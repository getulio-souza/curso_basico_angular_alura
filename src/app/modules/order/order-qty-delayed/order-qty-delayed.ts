import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { flatten, groupBy } from 'underscore';
import { OrderHelperService } from '../../../order/order-helper.service';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-order-qty-delayed',
  templateUrl: './order-qty-delayed.html',
  styleUrls: ['./order-qty-delayed.scss']
})
export class OrderQtyDelayed implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: string }>

  @Input() startDate: number;
  @Input() endDate: number;

  selectedWard: string;
  wards: string[];

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;

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

    this.pickWard(null);
    this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: string }) => {
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.pickWard(this.wards != null ? this.wards[0] : null);
    });
  }

  loadCategoryChart(category: string) {
    forkJoin(this.eventsMockedService.getEvents('DelayedOrder'), this.eventsMockedService.getEvents('CreateOrder')).subscribe(res => {
      const delayedOrderEvents = res[0];
      const createOrderEvents = res[1];

      if (category != null) {
        this.selectedWard = category;
      } else {
        this.wards = [this.allLabel];
        this.selectedWard = this.wards[0];
        this.wards = this.wards.concat(Array.from(new Set(flatten(delayedOrderEvents.map(event => this.orderHelperService.getWards(event.tags, this.organizations))))));
      }

      const delayedOrderEventsFiltered = this.filterEvents(delayedOrderEvents);
      const createOrderEventsFiltered = this.filterEvents(createOrderEvents);

      this.groupByAndGetTarget(delayedOrderEventsFiltered, createOrderEventsFiltered).subscribe(groupedBy => {
        this.setupChartBar(groupedBy);
      });

    });
  }

  private filterEvents(events: OrderEvent[]) {
    const eventsFiltered = this.selectedWard == this.allLabel ? events : events.filter(event => this.orderHelperService.getWards(event.tags, this.organizations).includes(this.selectedWard));
    const eventsFiltered2 = this.filterByStartAndEndDate(eventsFiltered);
    return eventsFiltered2;
  }

  pickWard(ward: string) {
    this.loadCategoryChart(ward);
  }

  groupByAndGetTarget(delayedOrders: OrderEvent[], createOrderEvents: OrderEvent[]): Observable<{ value: number; target: number; name: string }[]> {
    const items = delayedOrders.map(event => { return { value: Number.parseInt(event.quantity), name: event.category, itemId: event.item } });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.name);
    const values = Object.values(grouped);
    const groupedBy = values.map(item => {
      return {
        value: item.reduce((acc, item) => acc += 1, 0) as number,
        name: item[0].name,
        itemId: item[0].itemId
      }
    });

    return this.orderService.getItems().pipe(map(itemConfs => {
      const groupedByWithTarget = groupedBy.map(item => {
        const itemWithTarget: { value: number; target: number; name: string } = JSON.parse(JSON.stringify(item));
        const itemConf = itemConfs.find(itemConf => itemConf.id == item.itemId);
        const targetPercent = itemConf != null ? itemConf.target : 100;

        const createdEventsQty = createOrderEvents.filter(createOrderEvent => createOrderEvent.itemId == item.itemId).length;

        itemWithTarget.target = Math.floor(createdEventsQty * (targetPercent / 100));

        return itemWithTarget;
      });
      return groupedByWithTarget;
    }));
  }

  setupChartBar(items: { value: number; target: number; name: string }[]) {
    // specify chart configuration item and data

    const optionOld: EChartOption = {
      color: OrderChartsConstants.COLORS,
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: true, title: 'data', lang: ['data', 'back'] },
          magicType: {
            show: true, type: ['line', 'bar', 'stack', 'titled'], title: {
              line: "line",
              bar: "bar",
              stack: "stack",
              tiled: "titled"
            }
          },
          restore: { show: true, title: 'bar and line' },
          saveAsImage: { show: true, title: 'save' }
        }
      },
      legend: {
        data: [this.lateLabel, this.targetLabel]
      },
      xAxis: [{
        type: 'category',
        data: items.map(item => item.name),
        axisPointer: {
          type: 'shadow'
        }
      }],
      yAxis: [{
        type: 'value',
        name: this.lateLabel
      }, {
        type: 'value',
        name: this.targetLabel
      }],
      series: [{
        name: this.lateLabel,
        type: 'bar',
        data: items.map(item => item.value)
      }, {
        name: this.targetLabel,
        type: 'line',
        data: items.map(item => item.target)
      }]
    };

    const option = OrderChartsConstants.getBarChartOptions(items/* , items.map(item => { return { name: item.name, value: item.value } }) */);
    option.color = OrderChartsConstants.COLORS_RED;


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