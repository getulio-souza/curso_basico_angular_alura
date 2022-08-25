import { OrderEventService } from "./../../../../../services/order/order-event.service";
import { OrderEvent } from "../../../model/order-event";
import { SingleDataStatistics } from "../../../../nps/components/nps-page/nps-page.component";
import { CHART_TYPES } from "../../../../dynamic-widgets/charts/charts.component";
import { Component, OnInit } from "@angular/core";
import { OrderCategoriesWardsSubjectsAndSectorsDTO } from "../../../model/order-categories-wards-and-subjects.dto";
import { OrderCategoryQuantityDTO } from "../../../model/order-category-quantity.dto";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-order-graphics-view",
  templateUrl: "./order-graphics-view.component.html",
  styleUrls: ["./order-graphics-view.component.scss"],
})
export class OrderGraphicsViewComponent implements OnInit {
  halfHourData: SingleDataStatistics[] = [];
  topFiveOppened: SingleDataStatistics[] = [];
  afterSlaData: SingleDataStatistics[] = [];

  CHART_TYPES = CHART_TYPES;

  seletorWards: string[] = [];
  seletorSubjects: string[] = [];

  cacheWard = null;
  cacheSubject = null;

  private loadingSubject: Subject<void> = new Subject<void>();

  loading = false;

  teste = [
    {
      label: "teste 1",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 3",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 2",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 4",
      value: [1, 2, 3, 4],
      week: null,
    },
  ];

  constructor(private orderEventService: OrderEventService) {}

  ngOnInit() {
    this.loadingSubject.pipe(debounceTime(200)).subscribe((_) => {
      this.loading = false;
    });
  }

  halfChartClickEvent(event: { to: string; value: any; extras: any }): void {
    if (event.to === "category" || event.to === null) {
      this.seletorSubjects = [];
      this.cacheWard = event.extras.ward;
      this.cacheSubject = event.extras.subject;
      this.findEventsCategoriesOpennedAtHalfhour(
        event.extras.ward,
        null,
        event.extras.subject,
        null,
        null
      );
    }
    if (event.to === "item") {
      this.findEventsOpennedAtHalfhour(
        event.extras.ward,
        event.value,
        event.extras.subject,
        null,
        null
      );
    }
  }

  selectedFilterEvent(event): void {
    if (!event.subject) {
      this.orderEventService
        .getSubjectsByWard(event.ward)
        .subscribe((response: OrderCategoriesWardsSubjectsAndSectorsDTO) => {
          this.seletorSubjects = response.subjects;
        });
    }

    this.findEventsCategoriesOpennedAtHalfhour(
      event.ward,
      null,
      event.subject,
      null,
      null
    );
  }

  private findEventsCategoriesOpennedAtHalfhour(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .findEventsCategoriesOpennedAtHalfhour(
        ward,
        category,
        subject,
        start,
        end
      )
      .subscribe((response: OrderCategoryQuantityDTO[]) => {
        this.halfHourData = response.map((category) => {
          this.loadingSubject.next();
          return Object.assign(
            {},
            {
              label: category.category,
              value: [category.quantity, category.min, category.max],
            }
          );
        });
      });
  }

  private findEventsOpennedAtHalfhour(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .findEventsOpennedAtHalfhour(ward, category, subject, start, end)
      .subscribe((events: OrderEvent[]) => {
        this.halfHourData = [];
        if (events.length) {
          const itens = new Set(events.map((item) => item.item));
          itens.forEach((item) => {
            const label = events.find((obj) => obj.item === item).labels
              ? events.find((obj) => obj.item === item).labels["pt"]
              : null;
            const quantity = events
              .filter((obj) => obj.item === item)
              .map((obj) => parseInt(obj.quantity))
              .reduce((act, nxt) => act + nxt);
            const min = events
              .filter((obj) => obj.item === item)
              .map((obj) => obj.timestamp)
              .reduce((prv, crt) => {
                return prv > crt ? crt : prv;
              });
            const max = events
              .filter((obj) => obj.item === item)
              .map((obj) => obj.timestamp)
              .reduce((prv, crt) => {
                return !(prv > crt) ? crt : prv;
              });
            this.halfHourData.push(
              Object.assign({}, { label, value: [quantity, max, min] })
            );
          });
        }
      });
  }

  afterSlaChartClickEvent(event: { to: string; value: any }): void {
    if (event.to === "category") {
      this.topFiveCategoriesWithDelayedOrders(null, null, null, null, null);
    }
    if (event.to === "item") {
      this.findEventsDelayed(null, event.value, null, null, null);
    }
  }

  private topFiveCategoriesWithDelayedOrders(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .topFiveCategoriesWithDelayedOrders(ward, category, subject, start, end)
      .subscribe((response: OrderCategoryQuantityDTO[]) => {
        this.loadingSubject.next();
        this.afterSlaData = response.map((category) => {
          return Object.assign(
            {},
            { label: category.category, value: [category.quantity] }
          );
        });
      });
  }

  private findEventsDelayed(ward, category, subject, start, end): void {
    this.orderEventService
      .findEventsDelayed(ward, category, subject, start, end)
      .subscribe((events: OrderEvent[]) => {
        this.afterSlaData = [];
        if (events.length) {
          const itens = new Set(events.map((item) => item.item));
          itens.forEach((item) => {
            const label = events.find((obj) => obj.item === item).labels
              ? events.find((obj) => obj.item === item).labels["pt"]
              : null;
            const quantity = events
              .filter((obj) => obj.item === item)
              .map((obj) => parseInt(obj.quantity))
              .reduce((act, nxt) => act + nxt);
            this.afterSlaData.push(
              Object.assign({}, { label, value: [quantity] })
            );
          });
        }
      });
  }
}
