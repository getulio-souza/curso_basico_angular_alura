import { NPSCategoryGlobalSatisfactionDTO } from "../../model/nps-category-global-satisfaction.dto";
import { NPSEvent } from "./../../model/nps-event";
import { NPSEventService } from "./../../../../services/nps/nps-event.service";
import { PropertiesService } from "@alis/ng-services";
import { StructureService } from "@alis/tracking-ng";
import { Component, EventEmitter, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PropertyDataLoader } from "../../../../home/propertyDataLoader";
import { DateService } from "../../../../services/date/date.service";
import { CHART_TYPES } from "../../../dynamic-widgets/charts/charts.component";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { NPSCategoriesWardsAndSubjectsDTO } from "../../model/nps-categories-wards-and-subjects.dto";
import {
  CollumnDefinition,
  GridNPSData,
} from "../collapse-grid-nps/collapse-grid-nps.component";
import { NPSClosedOrderDTO } from "../../model/nps-closed-order.dto";
import { NPSCategoryDTO } from "../../model/nps-by-category.dto";
import { NPSCategoryLowerThanSevenDTO } from "../../model/nps-category-lower-than-seven.dto";
import { NPSDataDetailChartDTO } from "../../model/nps-data-detail-chart.dto";

export interface SingleDataStatistics {
  label: string;
  value: number[];
  week?: number;
}

export enum CHART_INDEX {
  NPS_GLOBAL_SATISFACTION,
  NPS_CLOSED_ORDERS,
  NPS_BY_CATEGORY,
  TOP_5_NPS_BELLOW_7,
}

interface Teste {
  label: string;
  value: string;
}

const EMPTY_OPTION = "Todos";

@Component({
  selector: "app-nps-page",
  templateUrl: "./nps-page.component.html",
  styleUrls: ["./nps-page.component.scss"],
})
export class NPSPageComponent extends PropertyDataLoader implements OnInit {
  private dateFilterSubject: Subject<void> = new Subject<void>();
  private dateRangeFilterSubject: Subject<void> = new Subject<void>();
  private loadingSubject: Subject<void> = new Subject<void>();

  //Teste
  optionsTeste: Teste[];

  CHART_TYPES = CHART_TYPES;
  CHART_INDEXES = CHART_INDEX;

  loading = false;
  startDate: number;
  endDate: number;
  dateChangedEvent: EventEmitter<{
    startDate: number;
    endDate: number;
    resolution: string;
  }> = new EventEmitter();

  // CHART-DATA
  globalSatisfactionData: SingleDataStatistics[] = [];
  npsByCategoryData: SingleDataStatistics[] = [];
  npsClosedOrdersData: SingleDataStatistics[] = [];
  categoriesNpsLowerThanSevenData: SingleDataStatistics[] = [];

  seletorCategoryClosedOrdersDataChart: string[] = [];
  seletorCategoryNPSByCategoryDataChart: string[] = [];
  seletorCategory: string[] = [];
  seletorWards: string[] = [];
  seletorSubjects: string[] = [];
  selectedCategoryNpsByCategoryFilter: string;
  selectedCategoryClosedOrdersFilter: string;

  adminView: boolean = true;

  sectorAdvancedSelecionado: string = null;
  sectorAdvanced: string[] = [];
  categoriesAdvancedSelecionado: string = null;
  categoriesAdvanced: string[] = [];
  wardsAdvancedSelecionado: string = null;
  wardsAdvanced: string[] = [];
  subjectsAdvancedSelecionado: string = null;
  subjectsAdvanced: string[] = [];
  chartGlobalSatiscationDataDetail: NPSDataDetailChartDTO[];
  chartGlobalClosedOrderDataDetail: NPSDataDetailChartDTO[];
  chartByCategoryDataDetail: NPSDataDetailChartDTO[];
  chartLowerThanSevenDataDetail: NPSDataDetailChartDTO[];

  rangeDates: Date[] = [new Date(), new Date()];
  rangeSelected: Date[] = [new Date(), new Date()];

  // GRID
  gridData: any[] = [{}];

  constructor(
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    private dateService: DateService,
    private npsEventService: NPSEventService
  ) {
    super(translateService, structureService, propertiesService);
  }

  ngOnInit() {
    //teste
    this.optionsTeste = [
      {
        label: "Novo Teste",
        value: "Novo Teste",
      },
      {
        label: "Novo Teste 2",
        value: "Novo Teste",
      },
      {
        label: "Novo Teste 3",
        value: "Novo Teste",
      },
    ];

    // Date Filters
    this.startDate = this.dateService.getOneDayBefore();
    this.endDate = new Date().getTime();

    this.loadingSubject.pipe(debounceTime(200)).subscribe((_) => {
      this.loading = false;
    });

    this.dateFilterSubject.pipe(debounceTime(1500)).subscribe((_) => {
      this.dispatchFilter();
    });

    setTimeout(() => this.refresh(), 30000);

    this.initView("admin");
  }

  async initView(view: string): Promise<void> {
    if (view === "admin") {
      this.adminView = true;
      this.dispatchFilter();
    }
    if (view === "detail") {
      this.loading = true;
      this.adminView = false;

      this.npsEventService
        .getCategoriesAndSubjects()
        .subscribe((response: NPSCategoriesWardsAndSubjectsDTO) => {
          this.categoriesAdvanced = [EMPTY_OPTION, ...response.categories];
          this.wardsAdvanced = [EMPTY_OPTION, ...response.wards];
          this.subjectsAdvanced = [EMPTY_OPTION, ...response.subjects];
          this.sectorAdvanced = [EMPTY_OPTION, ...response.sectors];
        });

      this.sectorAdvancedSelecionado = null;
      this.categoriesAdvancedSelecionado = null;
      this.wardsAdvancedSelecionado = null;
      this.subjectsAdvancedSelecionado = null;
      this.subjectsAdvanced = [];

      this.npsClosedOrdersData = [];
      this.categoriesNpsLowerThanSevenData = [];

      this.dispatchFilterDetail();
    }
  }

  selectedFilterEvent(event, chartIndex): void {
    const category = event.category === EMPTY_OPTION ? null : event.category;
    switch (chartIndex) {
      case CHART_INDEX.NPS_BY_CATEGORY:
        this.findNPSByCategory(
          this.startDate,
          this.endDate,
          category,
          null,
          null,
          null,
          true
        );
        this.selectedCategoryNpsByCategoryFilter = category;
        break;
      case CHART_INDEX.NPS_CLOSED_ORDERS:
        this.findNPSClosedOrders(
          this.startDate,
          this.endDate,
          category,
          null,
          null,
          null,
          true
        );
        this.selectedCategoryClosedOrdersFilter = category;
        break;
      default:
        break;
    }
  }

  setRangeDate(event): void {
    this.rangeSelected = [event.startDate, event.endDate].map(
      (date) => new Date(date)
    );
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.dateRangeFilterSubject.next();
  }

  dispatchFilter(): void {
    const initial = new Date(this.startDate);
    const final = new Date(this.endDate);

    this.npsByCategoryData = [];
    this.npsClosedOrdersData = [];
    this.categoriesNpsLowerThanSevenData = [];
    this.globalSatisfactionData = [];

    this.findEventsGlobalSatisfaction(
      initial.getTime(),
      final.getTime(),
      null,
      null,
      null,
      null
    );
    this.findNPSClosedOrders(
      initial.getTime(),
      final.getTime(),
      null,
      null,
      null,
      null
    );
    this.findCategoriesNPSLowerThanSeven(
      initial.getTime(),
      final.getTime(),
      null,
      null,
      null,
      null
    );
    this.findNPSByCategory(
      initial.getTime(),
      final.getTime(),
      null,
      null,
      null,
      null
    );
  }

  dispatchFilterDetail(): void {
    const initial = new Date(this.startDate);
    const final = new Date(this.endDate);

    this.gridData = [];
    this.npsByCategoryData = [];
    this.npsClosedOrdersData = [];
    this.categoriesNpsLowerThanSevenData = [];
    this.globalSatisfactionData = [];

    this.findEventsGlobalSatisfaction(
      initial.getTime(),
      final.getTime(),
      this.categoriesAdvancedSelecionado,
      this.sectorAdvancedSelecionado,
      this.wardsAdvancedSelecionado,
      this.subjectsAdvancedSelecionado
    );
    this.findNPSClosedOrders(
      initial.getTime(),
      final.getTime(),
      this.categoriesAdvancedSelecionado,
      this.sectorAdvancedSelecionado,
      this.wardsAdvancedSelecionado,
      this.subjectsAdvancedSelecionado
    );
    this.findCategoriesNPSLowerThanSeven(
      initial.getTime(),
      final.getTime(),
      this.categoriesAdvancedSelecionado,
      this.sectorAdvancedSelecionado,
      this.wardsAdvancedSelecionado,
      this.subjectsAdvancedSelecionado
    );
    this.findNPSByCategory(
      initial.getTime(),
      final.getTime(),
      this.categoriesAdvancedSelecionado,
      this.sectorAdvancedSelecionado,
      this.wardsAdvancedSelecionado,
      this.subjectsAdvancedSelecionado
    );
  }

  onNavigationDateChange(event): void {
    this.loading = true;
    this.startDate = event.startDate;
    this.endDate = event.endDate;

    this.dateFilterSubject.next();
  }

  private findEventsGlobalSatisfaction(
    start,
    end,
    category,
    sector,
    ward,
    subject
  ): void {
    this.npsEventService
      .findEventsGlobalSatisfaction(start, end, category, sector, ward, subject)
      .subscribe((response: NPSCategoryGlobalSatisfactionDTO) => {
        this.loadingSubject.next();
        if (response && response.dataChart) {
          this.chartGlobalClosedOrderDataDetail = response.details;
          this.globalSatisfactionData = response.dataChart.map((data) => {
            return Object.assign(
              {},
              { label: data.category, value: [data.average] }
            );
          });
        }
      });
  }

  private findNPSByCategory(
    start,
    end,
    category,
    sector,
    ward,
    subject,
    fromFilter = false
  ): void {
    this.npsEventService
      .findNPSByCategory(start, end, category, sector, ward, subject)
      .subscribe((response: NPSCategoryDTO) => {
        this.loadingSubject.next();
        this.seletorCategoryNPSByCategoryDataChart = [];
        this.npsByCategoryData = [];
        if (response && response.dataChart) {
          this.chartByCategoryDataDetail = response.details;
          if (!fromFilter) {
            this.seletorCategoryNPSByCategoryDataChart = [
              EMPTY_OPTION,
              ...response.categoriesFilter,
            ];
          }
          this.npsByCategoryData = response.dataChart.map((item) => {
            return Object.assign(
              {},
              { label: item.dateRef, value: [item.average] }
            );
          });
        }
      });
  }

  private findNPSClosedOrders(
    start,
    end,
    category,
    sector,
    ward,
    subject,
    fromFilter = false
  ): void {
    this.npsEventService
      .findNPSClosedOrders(start, end, category, sector, ward, subject)
      .subscribe((response: NPSClosedOrderDTO) => {
        this.loadingSubject.next();
        this.npsClosedOrdersData = [];
        this.seletorCategoryClosedOrdersDataChart = [];
        if (response && response.dataChart) {
          this.chartByCategoryDataDetail = response.details;
          if (!fromFilter) {
            this.seletorCategoryClosedOrdersDataChart = [
              EMPTY_OPTION,
              ...response.categoriesFilter,
            ];
          }
          this.npsClosedOrdersData = response.dataChart.map((value) => {
            return Object.assign({}, { label: "", value: [value] });
          });
        }
      });
  }

  private findCategoriesNPSLowerThanSeven(
    start,
    end,
    category,
    sector,
    ward,
    subject
  ): void {
    this.npsEventService
      .findCategoriesNPSLowerThanSeven(
        start,
        end,
        category,
        sector,
        ward,
        subject
      )
      .subscribe((response: NPSCategoryLowerThanSevenDTO) => {
        if (response && response.dataChart) {
          this.chartLowerThanSevenDataDetail = response.details;
          this.categoriesNpsLowerThanSevenData = response.dataChart.map(
            (data) => {
              return Object.assign(
                {},
                { label: data.category, value: [data.average] }
              );
            }
          );
        }
      });
  }

  // NEW FILTERS ADVANCED
  selecionarCategoriaDetail(event: string): void {
    this.loading = true;
    this.categoriesAdvancedSelecionado = event === EMPTY_OPTION ? null : event;
  }

  selecionarAlaDetail(event: string): void {
    this.loading = true;
    this.wardsAdvancedSelecionado = event === EMPTY_OPTION ? null : event;
  }

  selecionarUnidadeDetail(event: string): void {
    this.loading = true;
    this.subjectsAdvancedSelecionado = event === EMPTY_OPTION ? null : event;
  }

  selecionarSetorDetail(event: string): void {
    this.loading = true;
    this.sectorAdvancedSelecionado = event === EMPTY_OPTION ? null : event;
  }

  gerarGridData(event): void {
    switch (event) {
      case "NPS Satisfação Global":
        this.gridData = this.chartGlobalClosedOrderDataDetail;
        break;
      case "NPS de Pedidos Fechados":
        this.gridData = this.chartGlobalClosedOrderDataDetail;
        break;
      case "NPS por Categoria":
        this.gridData = this.chartByCategoryDataDetail;
        break;
      case "Top 5 Categorias com NPS Detractor (Abaixo de 7)":
        this.gridData = this.chartLowerThanSevenDataDetail;
        break;
      default:
        break;
    }
  }

  convertNPSToGridData(nps): GridNPSData {
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
        category: nps.npsItems[0].item.categoryId,
        item: nps.npsItems[0].item.descriptions["pt"],
        sector: nps.npsItems[0].item.sector,
        location: `${nps.wardFullQualified}/${nps.location}`,
        created: nps.createdAt
          ? new Date(nps.createdAt).toLocaleString("pt-BR")
          : null,
        updated: nps.lastUpdate
          ? new Date(nps.lastUpdate).toLocaleString("pt-BR")
          : null,
        finished: nps.finishedAt
          ? new Date(nps.finishedAt).toLocaleString("pt-BR")
          : null,
        estimated: nps.deliveryEstimate
          ? new Date(nps.deliveryEstimate).toLocaleString("pt-BR")
          : null,
        doneTime: nps.finishedAt
          ? doneTime(nps.finishedAt, nps.createdAt)
          : null,
        user: nps.requesterName,
      }
    );
  }

  refresh(): void {
    this.loading = false;
    if (this.adminView) {
      this.dispatchFilter();
    } else {
      this.dispatchFilterDetail();
    }
  }

  doFilter() {
    if (this.adminView) {
      this.loading = true;
      this.dispatchFilter();
    } else {
      this.dispatchFilterDetail();
    }
  }
}
