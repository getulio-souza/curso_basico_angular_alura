import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { DateService } from '../../../../services/date/date.service';
import { OrderService } from '../../../../services/order/order.service';
import { Order } from '../../model/order';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent extends PropertyDataLoader implements OnInit {

  cardIdSelected: number;
  cardSelectedBgColor: any;
  chartNumber: number;
  chartStatus: any;
  chartAverage: number;
  loading: boolean = false;

  components = ['order-qty-chart', 'order-qty-chart-by-days', 'order-qty-delayed', 'avg-elapsed-time-by-practitioner', 'order-by-sectors-chart', 'top4-most-demand-by-category-chart', 'avg-elapsed-time-by-category']

  // owl carousel
  config: any = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    nav: false,
    responsiveClass: true,
    stagePadding: 10,
    navText: [
      '<i class="material-icons">keyboard_arrow_left</i>',
      '<i class="material-icons">keyboard_arrow_right</i>'
    ],
    navContainer: '.main-content .custom-nav',
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
  };

  cards = [];
  data = [];

  resolution: 'hour' | 'day' | 'month' = 'day';
  startDate: number;
  endDate: number;

  openDiv = [false, false, false, false, false, false, false, false];

  dateChangedEvent: EventEmitter<{ startDate: number, endDate: number, resolution: string }> = new EventEmitter();

  constructor(
    private orderService: OrderService,
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    private dateService: DateService,
    private activedRoute: ActivatedRoute
  ) {
    super(
      translateService,
      structureService,
      propertiesService
    );

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    this.loading = true;
    let requested = 0;
    let inProgress = 0;
    let toCancel = 0
    let done = 0;
    let notDone = 0;
    let cancelled = 0;
    let delayed = 0;

    this.cards = [
      { id: 1, value: requested, color: '#33cccc', average: 1123, status: 'REQUESTED' },
      { id: 2, value: inProgress, color: '#00cc99', average: 27, status: 'IN_PROGRESS' },
      { id: 3, value: toCancel, color: '#ffcc00', average: 10, status: 'TO_CANCEL' },
      { id: 4, value: done, color: '#0066ff', average: 112, status: 'DONE' },
      { id: 5, value: notDone, color: '#8c8c8c', average: 112, status: 'NOT_DONE' },
      { id: 6, value: cancelled, color: '#f2f2f2', average: 112, status: 'CANCELLED' },
      { id: 7, value: delayed, color: '#cc3300', average: 112, status: 'DELAYED' }
    ];

    this.orderService.getOrders().subscribe((orders) => {
      this.data = orders;

      this.data.forEach((order: Order) => {
        if (typeof order.deliveryEstimate !== 'undefined' && order.deliveryEstimate !== null && new Date(order.deliveryEstimate).getTime() < Date.now()) {
          delayed++;
        }
        switch (order.status) {
          case 'REQUESTED':
            requested++;
            break;
          case 'IN_PROGRESS':
            inProgress++;
            break;
          case 'TO_CANCEL':
            toCancel++;
          case 'DONE':
            done++;
          case 'CANCELLED':
            cancelled++;
        }
      });

      this.cards = [
        { id: 1, value: requested, color: '#33cccc', average: 1123, status: 'REQUESTED' },
        { id: 2, value: inProgress, color: '#00cc99', average: 27, status: 'IN_PROGRESS' },
        { id: 3, value: toCancel, color: '#ffcc00', average: 10, status: 'TO_CANCEL' },
        { id: 4, value: done, color: '#0066ff', average: 112, status: 'DONE' },
        { id: 5, value: notDone, color: '#8c8c8c', average: 112, status: 'NOT_DONE' },
        { id: 6, value: cancelled, color: '#f2f2f2', average: 112, status: 'CANCELLED' },
        { id: 7, value: delayed, color: '#cc3300', average: 112, status: 'DELAYED' }
      ];
      this.loading = false;
    });
  }

  ngOnInit() {
    this.cardIdSelected = this.cards[0].id;
    this.cardSelectedBgColor = this.cards[0].color;
    this.chartStatus = this.cards[0].status;
    this.chartAverage = this.cards[0].average;

    this.startDate = this.dateService.getBeginCurrentWeek();
    this.endDate = this.dateService.getEndCurrentWeek();

    this.activedRoute.queryParams.subscribe(query => {
      let component = query.component;
      if (component) {
        this.components = this.components.filter(item => item == component);
      }
    })
  }

  afterPropertyHasBeenLoaded() {
    this.propertyId = this.properties.propertyId;
  }

  onCardClick(card) {
    this.cardIdSelected = card.id;
    this.cardSelectedBgColor = card.color;
    this.chartNumber = card.id;
    this.chartStatus = card.status;
    this.chartAverage = card.average;

    this.orderService.getOrdersByStatus(card.status).subscribe((list) => {
      this.data = list;
    });
  }

  onNavigationDateChange(event: { startDate: number, endDate: number, resolution: 'hour' | 'day' | 'month' }) {
    this.dateChangedEvent.emit(event);
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.resolution = event.resolution;
  }

}
