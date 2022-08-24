import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "./../../../../services/order/order.service";
import { OrderCategoryQuantityDTO } from "./../../model/order-category-quantity.dto";
import { OrderEvent } from "./../../model/order-event";
import { OrderEventService } from "./../../../../services/order/order-event.service";
import { PropertiesService } from "@alis/ng-services";
import { StructureService } from "@alis/tracking-ng";
import { Component, EventEmitter, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PropertyDataLoader } from "../../../../home/propertyDataLoader";
import { DateService } from "../../../../services/date/date.service";
import { CHART_TYPES } from "../../../dynamic-widgets/charts/charts.component";
import { interval, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { OrderWardQuantityDTO } from "../../model/ordar-ward-quantity.dto";
import { OrderCategoriesWardsSubjectsAndSectorsDTO } from "../../model/order-categories-wards-and-subjects.dto";
import {
  CollumnDefinition,
  GridOrderData,
} from "../../../dynamic-widgets/collapse-grid/collapse-grid.component";

export interface SingleDataStatistics {
  label: string;
  value: number[];
  week?: number;
}

@Component({
  selector: "app-produtividade-page",
  templateUrl: "./produtividade.component.html",
  styleUrls: ["./produtividade.component.scss"],
})
export class ProdutividadePageComponent
  extends PropertyDataLoader
  implements OnInit
{
  loading = false;
  private loadingSubject: Subject<void> = new Subject<void>();

  private readonly TRINTA_SEGUNDOS = 30000;

  private dateFilterSubject: Subject<void> = new Subject<void>();
  private dateRangeFilterSubject: Subject<void> = new Subject<void>();
  private advancedFilterSubject: Subject<any> = new Subject<any>();

  initOpts;
  CHART_TYPES = CHART_TYPES;
  categories = [];
  categorie;
  category;

  categorias: string[] = [];

  cols: CollumnDefinition[] = [
    { field: "ward", header: "Ala" },
    { field: "quantity", header: "Quantidade" },
  ];

  data = [];

  resolution: "hour" | "day" | "month" = "day";
  startDate: number;
  endDate: number;
  dateChangedEvent: EventEmitter<{
    startDate: number;
    endDate: number;
    resolution: string;
  }> = new EventEmitter();

  // CHART-DATA
  halfHourData: SingleDataStatistics[] = [];
  topFiveOppened: SingleDataStatistics[] = [];
  afterSlaData: SingleDataStatistics[] = [];

  cachePizzaCategory: string = null;

  seletorWards: string[] = [];
  seletorSubjects: string[] = [];

  adminView: boolean = true;

  statusAdvancedSelecionado: string = null;
  statusAdvanced: string[] = [];
  categoriesAdvancedSelecionado: string = null;
  categoriesAdvanced: string[] = [];
  wardsAdvancedSelecionado: string = null;
  wardsAdvanced: string[] = [];
  subjectsAdvancedSelecionado: string = null;
  subjectsAdvanced: string[] = [];
  sectorsAdvancedSelecionado: string = null;
  sectorsAdvanced: string[] = [];
  slaAdvancedSelecionado: string = null;
  slaAdvanced: string[] = [];

  rangeDates: Date[] = [new Date(), new Date()];
  rangeSelected: Date[] = [new Date(), new Date()];

  opennedAdvance: any[] = [];
  categoriesAdvance: any[] = [];
  afterSlaAdvance: any[] = [];
  wardsAdvance: any[] = [];

  cacheWard = null;
  cacheSubject = null;

  // GRID
  gridData: any[] = [{}];
  graficoGrid:
    | "Pedidos por Situação x Tempo de Espera"
    | "Pedidos finalizados fora do SLA por Área"
    | "Pedidos por Área"
    | "Pedidos por Ala" = "Pedidos por Situação x Tempo de Espera";

  // EXTERNO
  acessoExterno = false;
  property = null;
  sector = null;
  orderToken = null;
  selectedPropertyId: string;

  // REFATORANDO
  options: any;

  constructor(
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    private dateService: DateService,
    private orderEventService: OrderEventService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(translateService, structureService, propertiesService);
    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });
  }

  async ngOnInit() {
    await this.loadRouteParams();

    this.loadingSubject.pipe(debounceTime(200)).subscribe((_) => {
      this.loading = false;
    });

    // Date Filters
    this.startDate = this.dateService.getOneDayBefore();
    this.endDate = new Date().getTime();

    this.dateFilterSubject.pipe(debounceTime(500)).subscribe((_) => {
      this.dispatchFilter(null);
    });

    this.dateRangeFilterSubject.pipe(debounceTime(500)).subscribe((_) => {
      this.dispatchDateRange();
    });

    this.advancedFilterSubject.pipe(debounceTime(5000)).subscribe((orders) => {
      this.advancedOrganize(orders);
    });

    setInterval(() => this.refresh(), this.TRINTA_SEGUNDOS);

    this.initView("admin");
  }

  public afterPropertyHasBeenLoaded() {
    this.selectedPropertyId = this.properties.propertyId;
  }

  async loadRouteParams() {
    const _this = this;
    _this.route.params.subscribe((response) => {
      if (response["property"] && response["sector"]) {
        _this.route.queryParams.subscribe((query) => {
          _this.acessoExterno = true;
          _this.orderToken = query.auth;
          _this.sector = response.sector;
          _this.orderEventService.setPropertyId(response.property);
          _this.orderService.setExterno(_this.orderToken);
          _this.orderService
            .validateAccess(_this.orderToken)
            .subscribe((validate) => {
              if (!validate) {
                _this.router.navigate([""]);
              }
            });
        });
      }
    });
  }

  async initView(view: string): Promise<void> {
    if (view === "admin") {
      this.adminView = true;

      setTimeout(() => {
        this.orderEventService
          .getCategoriesAndSubjects()
          .subscribe((response: OrderCategoriesWardsSubjectsAndSectorsDTO) => {
            this.seletorWards = response.wards;
          });

        this.findEventsCategoriesOpennedAtHalfhour(
          null,
          null,
          null,
          null,
          null
        );
        this.topFiveCategoriesWithOpennedOrders(null, null, null, null, null);
        this.topFiveWardsAndOppenedOrdersQuantityForTable(
          null,
          null,
          null,
          null,
          null
        );
      }, 1500);
    }
    if (view === "detail") {
      this.adminView = false;
      this.loading = true;

      this.orderEventService
        .getCategoriesAndSubjects()
        .subscribe((response: OrderCategoriesWardsSubjectsAndSectorsDTO) => {
          this.categoriesAdvanced = response.categories;
          this.wardsAdvanced = response.wards;
          if (this.acessoExterno) {
            this.sectorsAdvanced = [this.sector];
          } else {
            this.sectorsAdvanced = response.sectors;
          }
        });

      this.statusAdvanced = [
        "Solicitado",
        "Em Andamento",
        "A cancelar",
        "Cancelado",
        "Feito",
        "Não Feito",
      ];

      this.slaAdvanced = ["Todos", "Dentro do Sla", "Fora do Sla"];

      this.statusAdvancedSelecionado = null;
      this.categoriesAdvancedSelecionado = null;
      this.wardsAdvancedSelecionado = null;
      this.subjectsAdvancedSelecionado = null;
      this.sectorsAdvancedSelecionado = this.acessoExterno ? this.sector : null;
      this.slaAdvancedSelecionado = null;
      this.subjectsAdvanced = [];

      this.afterSlaData = [];

      this.rangeSelected = [new Date(), new Date()];
      const rangeString = [new Date(), new Date()]
        .map((date) => date.getTime())
        .toString()
        .replace("[", "")
        .replace("]", "");
      this.orderService
        .ordersFilteredForAdvancedView(
          null,
          null,
          null,
          null,
          null,
          rangeString,
          null,
          null
        )
        .subscribe((resp) => {
          this.advancedFilterSubject.next(resp);
        });
    }
  }

  setRangeDate(event): void {
    this.rangeSelected = [event.startDate, event.endDate].map(
      (date) => new Date(date)
    );
    this.dateRangeFilterSubject.next();
  }

  pickCategory(category: string) {
    this.dispatchFilter(category);
  }

  dispatchFilter(category: string): void {
    const initial = new Date(this.startDate);
    const final = new Date(this.endDate);

    this.topFiveCategoriesWithDelayedOrders(
      null,
      null,
      null,
      initial.getTime(),
      final.getTime()
    );
  }

  onNavigationDateChange(event): void {
    this.loading = true;
    this.startDate = event.startDate;
    this.endDate = event.endDate;

    this.dateFilterSubject.next();
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

  clickPizza(event: { to: string; value: any }): void {
    if (event.to === "category") {
      this.cachePizzaCategory = null;
      this.topFiveCategoriesWithOpennedOrders(null, null, null, null, null);
    } else if (event.to === "ward") {
      this.cachePizzaCategory = event.value;
      this.topFiveWardsAndOppenedOrdersQuantity(
        null,
        event.value,
        null,
        null,
        null
      );
    } else if (event.to === "item") {
      this.findEventsOpennedOrders(
        event.value,
        this.cachePizzaCategory,
        null,
        null,
        null
      );
    }
  }

  private topFiveCategoriesWithOpennedOrders(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .topFiveCategoriesWithOpennedOrders(ward, category, subject, start, end)
      .subscribe((response: OrderCategoryQuantityDTO[]) => {
        this.topFiveOppened = response.map((category) => {
          this.loadingSubject.next();
          return Object.assign(
            {},
            { label: category.category, value: [category.quantity] }
          );
        });
      });
  }

  private topFiveWardsAndOppenedOrdersQuantity(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .topFiveWardsAndOppenedOrdersQuantity(ward, category, subject, start, end)
      .subscribe((response: OrderWardQuantityDTO[]) => {
        this.topFiveOppened = response.map((ward) => {
          return Object.assign(
            {},
            { label: ward.ward, value: [ward.quantity] }
          );
        });
      });
  }

  private findEventsOpennedOrders(ward, category, subject, start, end): void {
    this.orderEventService
      .findEventsOpennedOrders(ward, category, subject, start, end)
      .subscribe((events: OrderEvent[]) => {
        this.topFiveOppened = [];
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
            this.topFiveOppened.push(
              Object.assign({}, { label, value: [quantity] })
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

  private topFiveWardsAndOppenedOrdersQuantityForTable(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .topFiveWardsAndOppenedOrdersQuantity(ward, category, subject, start, end)
      .subscribe((response: OrderWardQuantityDTO[]) => {
        this.data = response.map((ward) => {
          this.loadingSubject.next();
          return Object.assign(
            {},
            { ward: ward.ward, quantity: ward.quantity }
          );
        });
      });
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

  // NEW FILTERS ADVANCED
  selecionarStatusDetail(event: string): void {
    this.loading = true;
    this.statusAdvancedSelecionado = event;
    const status = this.orderService.orderStatus().get(event);
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        this.sectorsAdvancedSelecionado,
        this.wardsAdvancedSelecionado,
        this.subjectsAdvancedSelecionado,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  selecionarCategoriaDetail(event: string): void {
    this.loading = true;
    this.categoriesAdvancedSelecionado = event;
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        event,
        this.sectorsAdvancedSelecionado,
        this.wardsAdvancedSelecionado,
        this.subjectsAdvancedSelecionado,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  selecionarSetorDetail(event: string): void {
    this.loading = true;
    this.sectorsAdvancedSelecionado = event;
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        event,
        this.wardsAdvancedSelecionado,
        this.subjectsAdvancedSelecionado,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  selecionarAlaDetail(event: string): void {
    this.loading = true;
    this.wardsAdvancedSelecionado = event;
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderEventService
      .getSubjectsByWard(event)
      .subscribe((response: OrderCategoriesWardsSubjectsAndSectorsDTO) => {
        this.subjectsAdvanced = response.subjects;
      });

    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        this.sectorsAdvancedSelecionado,
        event,
        null,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  selecionarUnidadeDetail(event: string): void {
    this.loading = true;
    this.subjectsAdvancedSelecionado = event;
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        this.sectorsAdvancedSelecionado,
        this.wardsAdvancedSelecionado,
        event,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  selecionarSlaDetail(event: string): void {
    this.loading = true;
    this.slaAdvancedSelecionado = event;
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        this.sectorsAdvancedSelecionado,
        this.wardsAdvancedSelecionado,
        this.subjectsAdvancedSelecionado,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  dispatchDateRange(): void {
    const status = this.statusAdvancedSelecionado
      ? this.orderService.orderStatus().get(this.statusAdvancedSelecionado)
      : null;
    const datas = this.rangeSelected
      .map((date) => date.getTime())
      .toString()
      .replace("[", "")
      .replace("]", "");
    this.orderService
      .ordersFilteredForAdvancedView(
        status,
        this.categoriesAdvancedSelecionado,
        this.sectorsAdvancedSelecionado,
        this.wardsAdvancedSelecionado,
        this.subjectsAdvancedSelecionado,
        datas,
        this.slaConvertOption(),
        null
      )
      .subscribe((resp) => {
        this.advancedFilterSubject.next(resp);
      });
  }

  slaConvertOption(): string {
    if (
      this.slaAdvancedSelecionado === null ||
      this.slaAdvancedSelecionado === "Todos"
    ) {
      return "none";
    } else if (this.slaAdvancedSelecionado === "Dentro do Sla") {
      return "in";
    } else if (this.slaAdvancedSelecionado === "Fora do Sla") {
      return "out";
    }
  }

  async advancedOrganize(orders) {
    const actualTime = new Date().getTime();
    const periods = [
      0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
      9.5, 10,
    ];

    const itens = new Set(
      orders.map((order) => order.orderItems[0].item.labels["pt"])
    );
    const itemQuantity = [];
    await itens.forEach((item) => {
      const quantity = orders
        .filter((order) => order.orderItems[0].item.labels["pt"] === item)
        .map((order) => order.orderItems[0].quantity)
        .reduce((acc, pvr) => acc + pvr);

      itemQuantity.push(Object.assign({ item, quantity }));
    });

    const itemPeriod = [];
    await itens.forEach((item) => {
      itemPeriod.push(
        Object.assign({}, { item, periods: new Map<string, number>() })
      );
      periods.forEach((period) => {
        itemPeriod.find((obj) => obj.item === item).periods.set(`${period}`, 0);
      });
      itemPeriod.find((obj) => obj.item === item).periods.set("+10", 0);

      const mapped = orders.filter(
        (order) => order.orderItems[0].item.labels["pt"] === item
      );
      mapped.forEach((order) => {
        const minuteTotal =
          (actualTime - new Date(order.createdAt).getTime()) / 1000 / 60;
        const horas = (minuteTotal / 60).toFixed(2);
        const split = horas.split(".");
        const formated = parseFloat(
          `${split[0]}.${
            Math.round(parseInt(split[1].substring(0, 2))) < 50 ? 5 : 0
          }`
        );
        const quantity = order.orderItems[0].quantity;

        if (periods.includes(formated)) {
          itemPeriod
            .find((obj) => obj.item === item)
            .periods.set(
              `${formated}`,
              itemPeriod
                .find((obj) => obj.item === item)
                .periods.get(`${formated}`) + quantity
            );
        } else {
          itemPeriod
            .find((obj) => obj.item === item)
            .periods.set(
              "+10",
              itemPeriod.find((obj) => obj.item === item).periods.get("+10") +
                quantity
            );
        }
      });
    });

    const categories = new Set(
      orders.map((order) => order.orderItems[0].item.categoryId)
    );
    const categoriesQuantity = [];
    await categories.forEach((category) => {
      const quantity = orders
        .filter((order) => order.orderItems[0].item.categoryId === category)
        .map((order) => order.orderItems[0].quantity)
        .reduce((acc, pvr) => acc + pvr);

      categoriesQuantity.push(Object.assign({}, { category, quantity }));
    });

    const categoriesPeriod = [];
    await categories.forEach((category) => {
      categoriesPeriod.push(
        Object.assign({}, { category, periods: new Map<string, number>() })
      );
      periods.forEach((period) => {
        categoriesPeriod
          .find((obj) => obj.category === category)
          .periods.set(`${period}`, 0);
      });
      categoriesPeriod
        .find((obj) => obj.category === category)
        .periods.set("+10", 0);

      const mapped = orders.filter(
        (order) => order.orderItems[0].item.categoryId === category
      );
      mapped.forEach((order) => {
        const minuteTotal =
          (actualTime - new Date(order.createdAt).getTime()) / 1000 / 60;
        const horas = (minuteTotal / 60).toFixed(2);
        const split = horas.split(".");
        const formated = parseFloat(
          `${split[0]}.${
            Math.round(parseInt(split[1].substring(0, 2))) < 50 ? 5 : 0
          }`
        );
        const quantity = order.orderItems[0].quantity;

        if (periods.includes(formated)) {
          categoriesPeriod
            .find((obj) => obj.category === category)
            .periods.set(
              `${formated}`,
              categoriesPeriod
                .find((obj) => obj.category === category)
                .periods.get(`${formated}`) + quantity
            );
        } else {
          categoriesPeriod
            .find((obj) => obj.category === category)
            .periods.set(
              "+10",
              categoriesPeriod
                .find((obj) => obj.category === category)
                .periods.get("+10") + quantity
            );
        }
      });
    });

    const wards = new Set(orders.map((order) => order.wardFullQualified));
    const wardsQuantity = [];
    await wards.forEach((ward) => {
      const quantity = orders
        .filter((order) => order.wardFullQualified === ward)
        .map((order) => order.orderItems[0].quantity)
        .reduce((acc, pvr) => acc + pvr);

      wardsQuantity.push(Object.assign({}, { category: ward, quantity }));
    });

    const categoriesDelayed = [];
    await categories.forEach(async (category) => {
      const mapped = orders.filter(
        (order) =>
          order.orderItems[0].item.categoryId === category &&
          order.deliveryEstimate !== null &&
          order.finishedAt !== null &&
          new Date(order.deliveryEstimate).getTime() <
            new Date(order.finishedAt).getTime()
      );
      const quantity = await mapped
        .map((order) => order.orderItems[0].quantity)
        .reduce((acc, pvr) => acc + pvr, 0);

      categoriesDelayed.push(Object.assign({}, { category, quantity }));
    });

    this.opennedAdvance = itemPeriod;
    this.categoriesAdvance = categoriesQuantity;
    this.afterSlaAdvance = categoriesDelayed;
    this.wardsAdvance = wardsQuantity;

    if (this.graficoGrid === "Pedidos finalizados fora do SLA por Área") {
      const mapped = orders.filter(
        (order) =>
          order.deliveryEstimate !== null &&
          order.finishedAt !== null &&
          new Date(order.deliveryEstimate).getTime() <
            new Date(order.finishedAt).getTime()
      );

      this.gridData = mapped.map((order) => this.convertOrderToGridData(order));
    } else {
      this.gridData = orders.map((order) => this.convertOrderToGridData(order));
    }

    this.loading = false;
  }

  gerarGridData(event): void {
    this.graficoGrid = event;
    this.dispatchDateRange();
  }

  convertOrderToGridData(order): GridOrderData {
    const doneTime = (doneStamp, createdStamp) => {
      return `${(
        (new Date(doneStamp).getTime() - new Date(createdStamp).getTime()) /
        1000 /
        60
      ).toFixed(0)} min`;
    };

    return Object.assign(
      {},
      {
        category: order.orderItems[0].item.categoryId,
        item: order.orderItems[0].item.descriptions["pt"],
        sector: order.orderItems[0].item.sector,
        location: `${order.wardFullQualified}/${order.location}`,
        created: order.createdAt
          ? new Date(order.createdAt).toLocaleString("pt-BR")
          : null,
        updated: order.lastUpdate
          ? new Date(order.lastUpdate).toLocaleString("pt-BR")
          : null,
        finished: order.finishedAt
          ? new Date(order.finishedAt).toLocaleString("pt-BR")
          : null,
        estimated: order.deliveryEstimate
          ? new Date(order.deliveryEstimate).toLocaleString("pt-BR")
          : null,
        doneTime: order.finishedAt
          ? doneTime(order.finishedAt, order.createdAt)
          : null,
        user: order.requesterName,
      }
    );
  }

  refresh(): void {
    this.loading = false;
    if (this.adminView) {
      this.findEventsCategoriesOpennedAtHalfhour(
        this.cacheWard,
        null,
        this.cacheSubject,
        null,
        null
      );
      this.topFiveCategoriesWithOpennedOrders(null, null, null, null, null);
      this.topFiveWardsAndOppenedOrdersQuantityForTable(
        null,
        null,
        null,
        null,
        null
      );
      this.dispatchFilter(null);
    } else {
      this.dateRangeFilterSubject.next();
    }
  }

  doFilter() {
    if (this.adminView) {
      this.loading = true;
      this.findEventsCategoriesOpennedAtHalfhour(
        this.cacheWard,
        null,
        this.cacheSubject,
        null,
        null
      );
      this.topFiveCategoriesWithOpennedOrders(null, null, null, null, null);
      this.topFiveWardsAndOppenedOrdersQuantityForTable(
        null,
        null,
        null,
        null,
        null
      );
      this.dispatchFilter(null);
    } else {
      this.dateRangeFilterSubject.next();
    }
  }
}
