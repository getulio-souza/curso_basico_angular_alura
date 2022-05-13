import { FilterComponent } from './../../../filter/filter.component';
import { SingleDataStatistics } from './../../order/components/produtividade/produtividade.component';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";

import { TranslateService } from '@ngx-translate/core';
// import { DataService } from '../../../services/data/data.service';
import { BehaviorSubject } from "rxjs";
import { ChartBarVerticalComponent } from './components/chart-bar-vertical/chart-bar-vertical.component';
import { ChartBarHorizontalComponent } from './components/chart-bar-horizontal/chart-bar-horizontal.component';
import { ChartPizzaComponent } from './components/chart-pizza/chart-pizza.component';
import { ChartLinesComponent } from './components/chart-lines/chart-lines.component';
import { ChartFunnelComponent } from './components/chart-funnel/chart-funnel.component';
import { ChartGaugeComponent } from './components/chart-gauge/chart-gauge.component';
import { ChartStackedLineComponent } from './components/chart-stacked-line/chart-stacked-line.component';
import { ChartBarVerticalSimpleComponent } from './components/chart-bar-vertical-simple/chart-bar-vertical-simple.component';
import { ChartBarVerticalNpsComponent } from './components/chart-bar-vertical-nps/chart-bar-vertical-nps.component';
import { ChartLinesNpsComponent } from './components/chart-lines-nps/chart-lines-nps.component';
import { PropertyDataLoader } from '../../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';

export enum CHART_TYPES {
  BAR_HORIZONTAL,
  BAR_VERTICAL,
  PIZZA,
  LINES,
  LINES_NPS,
  FUNNEL,
  GAUGE,
  STACKED_LINE,
  BAR_VERTICAL_SIMPLE,
  BAR_VERTICAL_NPS
}

export const TOOLBOX = {
  feature: {
    dataView: { show: true, readOnly: true, title: 'data', lang: ['data', 'back'], textColor: 'white' },
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
};

@Component({
  selector: 'app-charts-component',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent extends PropertyDataLoader implements OnInit, OnChanges, AfterViewInit {
  @Output() clickBarVerticalEvent: EventEmitter<{to: string, value: any, extras: any}> = new EventEmitter<{to: string, value: any, extras: any}>();
  @Output() clickPizzaEvent: EventEmitter<{to: string, value: any}> = new EventEmitter<{to: string, value: any}>();

  @Output() selectedFilterEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() itens: SingleDataStatistics[];
  @Input() value: number;

  @ViewChild(ChartBarVerticalComponent, {static: false}) chartBarVertical: ChartBarVerticalComponent;
  @ViewChild(ChartBarHorizontalComponent, {static: false}) chartBarHorizontal: ChartBarHorizontalComponent;
  @ViewChild(ChartPizzaComponent, {static: false}) chartPizza: ChartPizzaComponent;
  @ViewChild(ChartLinesComponent, {static: false}) chartLines: ChartLinesComponent;
  @ViewChild(ChartLinesNpsComponent, {static: false}) chartLinesNps: ChartLinesNpsComponent;
  @ViewChild(ChartFunnelComponent, {static: false}) chartFunnel: ChartFunnelComponent;
  @ViewChild(ChartGaugeComponent, {static: false}) chartGauge: ChartGaugeComponent;
  @ViewChild(ChartStackedLineComponent, {static: false}) chartStackedLine: ChartStackedLineComponent;
  @ViewChild(ChartBarVerticalSimpleComponent, {static: false}) chartBarVerticalSimple: ChartBarVerticalSimpleComponent;
  @ViewChild(ChartBarVerticalNpsComponent, {static: false}) chartBarVerticalNps: ChartBarVerticalNpsComponent;

  @ViewChild(FilterComponent, {static: false}) filter: FilterComponent;

  @Input() title: string;
  @Input() type: CHART_TYPES;
  isFinishLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  loaded = false;
  @Input() exibirSeletorCategoria = false;
  @Input() exibirSeletor = false;
  @Input() showCaption = true;

  CHART_TYPES = CHART_TYPES;

  @Input()
  selectedCategory: string = null;
  @Input() seletorCategory: string[] = [];
  categories: string[] = [];

  selectedWard: string = null;
  @Input() seletorWards: string[] = [];
  wards: string[] = [];

  selectedSubject: string = null;
  @Input() seletorSubjects: string[] = [];
  subjects: string[] = [];

  // lang: string;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService
  ) {
    super(translateService,structureService, propertiesService);

  }

  ngOnInit(): void {
    this.isFinishLoading$.next(true);

  }

  ngAfterViewInit(): void {
    this.loaded = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itens && changes.itens.currentValue.length) {
      this.configureWithTypeAsset(this.itens);
    }

    if (changes.itens && this.loaded && !changes.itens.currentValue.length) {
      this.clearWithTypeAsset();
    }

    if (changes.value && this.loaded && this.type === CHART_TYPES.GAUGE) {
      this.configureGauge(this.value);
    }

    if (changes.seletorCategory && changes.seletorCategory.currentValue.length) {
      this.categories = this.seletorCategory;
    }

    if (changes.seletorWards && changes.seletorWards.currentValue.length) {
      this.wards = this.seletorWards;
    }

    if (changes.seletorSubjects && changes.seletorSubjects.currentValue.length) {
      this.subjects = this.seletorSubjects;
    }
  }

  charts: any[] = [
    { type: CHART_TYPES.BAR_HORIZONTAL, attribute: 'chartBarHorizontal', shouldApply: true },
    { type: CHART_TYPES.BAR_VERTICAL, attribute: 'chartBarVertical', shouldApply: true },
    { type: CHART_TYPES.PIZZA, attribute: 'chartPizza', shouldApply: true },
    { type: CHART_TYPES.LINES, attribute: 'chartLines', shouldApply: true },
    { type: CHART_TYPES.FUNNEL, attribute: 'chartFunnel', shouldApply: true },
    { type: CHART_TYPES.GAUGE, attribute: 'chartGauge', shouldApply: false },
    { type: CHART_TYPES.STACKED_LINE, attribute: 'chartStackedLine', shouldApply: true },
    { type: CHART_TYPES.BAR_VERTICAL_SIMPLE, attribute: 'chartBarVerticalSimple', shouldApply: true },
    { type: CHART_TYPES.BAR_VERTICAL_NPS, attribute: 'chartBarVerticalNps', shouldApply: true },
    { type: CHART_TYPES.LINES_NPS, attribute: 'chartLinesNps', shouldApply: true }
  ]

  configureWithTypeAsset(itens: SingleDataStatistics[]): void {
    if (itens.length) {

      setTimeout(() => {

        this.executeOnSelectedChart((item): void => item.configureChart(itens))
        
        // switch (this.type) {
        //   case CHART_TYPES.BAR_HORIZONTAL:
        //     this.chartBarHorizontal.configureChart(itens);
        //   break;
        //   case CHART_TYPES.BAR_VERTICAL:
        //     this.chartBarVertical.configureChart(itens);
        //   break;
        //   case CHART_TYPES.PIZZA:
        //     this.chartPizza.configureChart(itens);
        //   break;
        //   case CHART_TYPES.LINES:
        //     this.chartLines.configureChart(itens);
        //   break;
        //   case CHART_TYPES.FUNNEL:
        //     this.chartFunnel.configureChart(itens);
        //   break;
        //   case CHART_TYPES.GAUGE:
        //     //this.chartGauge.configureChart(itens);
        //   break;
        //   case CHART_TYPES.STACKED_LINE:
        //     this.chartStackedLine.configureChart(itens);
        //   break;
        //   case CHART_TYPES.BAR_VERTICAL_SIMPLE:
        //     this.chartBarVerticalSimple.configureChart(itens);
        //   break;
        //   case CHART_TYPES.BAR_VERTICAL_NPS:
        //     this.chartBarVerticalNps.configureChart(itens);
        //   break;
        //   case CHART_TYPES.LINES_NPS:
        //     this.chartLinesNps.configureChart(itens);
        //   break;
        //   default:
        //     console.log('NOT MAPPED CHART TYPE')
        // }
      }, 500);

    }
  }

  clearWithTypeAsset(): void {

    this.executeOnSelectedChart((item): void => item.clearChart())

    // switch (this.type) {
    //   case CHART_TYPES.BAR_HORIZONTAL:
    //     this.chartBarHorizontal ? this.chartBarHorizontal.clearChart() : {};
    //   break;
    //   case CHART_TYPES.BAR_VERTICAL:
    //     this.chartBarVertical ? this.chartBarVertical.clearChart() : {};
    //   break;
    //   case CHART_TYPES.PIZZA:
    //     this.chartPizza ? this.chartPizza.clearChart() : {};
    //   break;
    //   case CHART_TYPES.LINES:
    //     this.chartLines ? this.chartLines.clearChart() : {};
    //   break;
    //   case CHART_TYPES.FUNNEL:
    //     this.chartFunnel ? this.chartFunnel.clearChart() : {};
    //   break;
    //   case CHART_TYPES.GAUGE:
    //     //this.chartGauge.clearChart();
    //   break;
    //   case CHART_TYPES.STACKED_LINE:
    //     this.chartStackedLine ? this.chartStackedLine.clearChart() : {};
    //   break;
    //   case CHART_TYPES.BAR_VERTICAL_SIMPLE:
    //     this.chartBarVerticalSimple ? this.chartBarVerticalSimple.clearChart() : {};
    //   break;
    //   case CHART_TYPES.BAR_VERTICAL_NPS:
    //     this.chartBarVerticalNps ? this.chartBarVerticalNps.clearChart() : {};
    //   break;
    //   case CHART_TYPES.LINES_NPS:
    //     this.chartLinesNps.clearChart();
    //   break;
    //   default:
    //     console.log('NOT MAPPED CHART TYPE')
    // }
  }

  executeOnSelectedChart(executeMethod: (item: any) => void) {
    const chart = this.charts.find(item => item.type === this.type);
        
    if(!chart) {
      console.log('NOT MAPPED CHART TYPE');
      return;
    }

    const attribute = this[chart.attribute];
    if(chart.shouldApply && attribute) {
      executeMethod(attribute);
    }
  }

  configureGauge(value: number) {
    this.chartGauge.configureChart(value);
  }

  clickVertical(event: {to: string, value: any}): void {
    this.clickBarVerticalEvent.emit({...event, extras: {ward: this.selectedWard, subject: this.selectedSubject}});
  }

  restoreVertical(): void {
    this.selectedWard = null;
    this.selectedSubject = null;
    this.subjects = [];

    this.clickBarVerticalEvent.emit({to: null, value: null, extras: {ward: null, subject: null}});
  }

  clickPizza(event: {to: string, value: any}): void {
    this.clickPizzaEvent.emit(event);
  }

  selecionarWard(event: string): void {
    this.selectedWard = event;
    this.selectedSubject = null;
    this.selectedFilterEvent.emit({ward: this.selectedWard, subject: this.selectedSubject});
  }

  selecionarSubject(event: string): void {
    this.selectedSubject = event;
    this.selectedFilterEvent.emit({ward: this.selectedWard, subject: this.selectedSubject});
  }

  selecionarCategory(event: string): void {
    this.selectedCategory = event;
    this.selectedFilterEvent.emit({category: this.selectedCategory});
  }
}

// getData() {
//   this.data = new Array();
//   this.reloadChartOptions();
//   this.dataService.getOccupancyAndConsumptionList(this.energyGroupId,
//                                       this.energyGroupId,
//                                       this.resolution,
//                                       this.startDate,
//                                       this.endDate,
//                                       null,
//                                       null)
//                   .subscribe((consumptionList: Consumption[]) => {
//                      this.translateService.get(['Savings', 'HVAC Engaged']).subscribe((translations) => {
//                             // translation loader is now ready
//                             let res = this.tkoChartBuilder.buildConsumeData(consumptionList, translations, null, this);
//                             this.data = res.data;
//                             this.roundValueInfo = res.roundValueInfo;
//                             this.reloadChartOptions();
//                       });
//                   });
// }

