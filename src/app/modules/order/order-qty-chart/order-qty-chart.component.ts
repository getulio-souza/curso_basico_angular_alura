import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { flatten, groupBy } from 'underscore';
import { OrderEventService } from '../../../services/order/order-event.service';
import { OrderEvent } from '../model/order-event';
import { OrderChartsConstants } from '../order-charts-constants';

@Component({
  selector: 'app-order-qty-chart',
  templateUrl: './order-qty-chart.component.html',
  styleUrls: ['./order-qty-chart.component.scss']
})
export class OrderQtyChartComponent implements OnInit {

  @Input() dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: string }>

  @Input() startDate: number;
  @Input() endDate: number;

  allLabel: string;

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLDivElement>;

  category: string;
  categories: string[]

  constructor(private eventsService: OrderEventService, private translateService: TranslateService) { }

  async ngOnInit() {

    this.allLabel = await this.translateService.get('All').toPromise();

    this.pickCategory(null);
    this.dateChangedEvent.subscribe((dates: { startDate: number, endDate: number, resolution: string }) => {
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.pickCategory(this.category);
    });
  }

  pickCategory(category: string) {
    this.eventsService.getEvents('CreateOrder').subscribe(events => {
      if (category == null) {
        this.categories = Array.from(new Set(flatten(events.map(event => event.category))));
        this.category = this.categories[0];
      } else {
        this.category = category;
      }

      const eventsFiltered = events.filter(event => event.category == this.category);

      const dateStart = this.startDate;
      const dateEnd = this.endDate;
      const eventsFiltered2 = eventsFiltered.filter(event => moment(event.date).isAfter(moment(dateStart)) && moment(event.date).isBefore(moment(dateEnd)));

      const groupedBy = this.groupByLabel(eventsFiltered2);
      this.setupChartBar(groupedBy);
    });
  }

  groupByLabel(events: OrderEvent[]): { qty: number; label: string; category: string }[] {
    const items = events.map(event => { return { label: event.item, category: event.category } });
    const itemsFlatten = flatten(items);
    const grouped = groupBy(itemsFlatten, item => item.label);
    const values = Object.values(grouped);
    const groupedBy = values.map(item => {
      return {
        qty: item.length,
        label: item[0].label,
        category: item[0].category
      }
    });

    return groupedBy;
  }

  setupChartBar(items: { qty: number; label: string }[]) {

    //TODO rafa
    const items2=[
      { qty: 2, label: 'Teste 1' },
      { qty: 14, label: 'Teste 2' },
      { qty: 35, label: 'Teste 3' },
      { qty: 10, label: 'Teste 4' },
      { qty: 5, label: 'Teste 5' },
      { qty: 20, label: 'Teste 6' },
      { qty: 26, label: 'Teste 7' },
      { qty: 5, label: 'Teste 8' },
      { qty: 20, label: 'Teste 9' },
      { qty: 26, label: 'Teste 10' }
    ]

    items = items2;
    // based on prepared DOM, initialize echarts instance
    const myChart = echarts.init(this.canvas.nativeElement);

    // specify chart configuration item and data
    const option: EChartOption = {
      color: OrderChartsConstants.COLORS,
      grid: {
        containLabel: true
      },
      yAxis: [{
        axisLine: {
          lineStyle: { color: OrderChartsConstants.COLOR_FONT }
        }
      }],
      xAxis: [{
        name: '',
        nameLocation: 'start',
        nameTextStyle: {
          fontWeight: 'bold',
          color: OrderChartsConstants.COLOR_FONT
        },
        position: 'bottom',
        offset: 0,
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: OrderChartsConstants.COLOR_FONT
          }
        },
        axisLabel: <any>{
          textStyle: {
            color: OrderChartsConstants.COLOR_FONT,
          },
          rotate: 90
        },
        inverse: false,
        data: items.map(item => item.label)
      }],
      series: [<any>{
        type: 'bar',
        data: items.map(item => item.qty),
        barWidth: '20%',
        label: {
          normal: {
            show: false,
            position: 'left',
            textStyle: { color: OrderChartsConstants.COLOR_FONT },
          }
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
  }

}
