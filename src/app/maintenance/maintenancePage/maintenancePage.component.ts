import {PropertyDataLoader} from '../../home/propertyDataLoader';
import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PropertiesService} from '@alis/ng-services';
import {StructureService} from '@alis/tracking-ng';
import {EventService} from '../../services/event/event.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenancePage.component.html',
  styleUrls: ['./maintenancePage.component.scss']
})
export class MaintenancePageComponent extends PropertyDataLoader implements OnInit {

  cardIdSelected: number;
  cardSelectedBgColor: any;
  chartNumber: number;
  chartStatus: any;
  chartAverage: number;

  constructor(
    private eventsService: EventService,
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
  ) {
    super(
      translateService,
      structureService,
      propertiesService
    );

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    this.eventsService.getCardsList().subscribe((cardsInfo) => {
      this.cards = cardsInfo;
    });

    this.eventsService.getEventsByStatus('open').subscribe((list) => {
      this.data = list;
    });
  }

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

  ngOnInit() {
    this.cardIdSelected = this.cards[0].id;
    this.cardSelectedBgColor = this.cards[0].color;
    this.chartStatus = this.cards[0].status;
    this.chartAverage = this.cards[0].average;
  }

  afterPropertyHasBeenLoaded() {
    console.log('afterPropertyHasBeenLoaded...', this.properties);
  }

  onCardClick(card) {
    this.cardIdSelected = card.id;
    this.cardSelectedBgColor = card.color;
    this.chartNumber = card.id;
    this.chartStatus = card.status;
    this.chartAverage = card.average;

    this.eventsService.getEventsByStatus(card.status).subscribe((list) => {
      this.data = list;
    });
  }
}
