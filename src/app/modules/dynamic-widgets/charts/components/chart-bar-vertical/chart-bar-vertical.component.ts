import { ChartsObservable } from "./../../charts.observable";
import { SingleDataStatistics } from "./../../../../order/components/produtividade/produtividade.component";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";

@Component({
  selector: "app-chart-bar-vertical",
  templateUrl: "./chart-bar-vertical.component.html",
})
export class ChartBarVerticalComponent implements OnInit {
  private static CATEGORY = "category";
  private static ITEM = "item";

  @Input() showCaption = true;
  @Output() clickBarVerticalEvent: EventEmitter<{ to: string; value: any }> =
    new EventEmitter<{ to: string; value: any }>();
  @Output() restoreVerticalEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild("chartBarVerticalCanvas", { static: true })
  chartBarVerticalCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  private actual = ChartBarVerticalComponent.CATEGORY;
  private subtext: string = "Categoria";

  constructor(private chartsObservable: ChartsObservable) {
    chartsObservable.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.chart.resize();
        }, 250);
      }
    });
  }

  ngOnInit(): void {
    this.initChart();
    window.addEventListener("resize", () => this.chart.resize());

    this.chart.on("click", (handler) => {
      this.dispatch(handler.name);
    });

    this.chart.on("restore", (_) => {
      this.actual = ChartBarVerticalComponent.CATEGORY;
      this.subtext = "Categoria";
      this.restoreVerticalEvent.emit();
    });
  }

  initChart(): void {
    this.chart = echarts.init(this.chartBarVerticalCanvas.nativeElement);
  }

  async configureChart(itens: SingleDataStatistics[]): Promise<void> {
    this.clearChart();

    const colors = ["#D48265", "#61A0A8", "#C23531"];
    const yAxisData = itens.map((item) => item.label);

    const yAxis = [];
    const series = [];
    if (itens[0].value[0]) {
      yAxis.push({
        type: "value",
        name: this.showCaption ? "Quantidade de Pedidos" : "",
        position: "left",
        axisLine: {
          show: false,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: "{value}",
          color: "#FFF",
        },
      });

      series.push({
        name: "Quantidade",
        type: "bar",
        data: [...itens.map((item) => item.value[0])],
        label: {
          show: true,
          position: "top",
          color: "#FFF",
        },
      });
    }

    // if (itens[0].value[1]) {
    //   yAxis.push({
    //     type: 'value',
    //     name: 'Máximo',
    //     position: 'right',
    //     alignTicks: true,
    //     offset: 55,
    //     axisLine: {
    //       show: true,
    //       lineStyle: {
    //         color: colors[2]
    //       }
    //     },
    //     axisLabel: {
    //       formatter: '{value} h'
    //     }
    //   });

    //   series.push(
    //     {
    //       name: 'Tempo Mínimo de Espera',
    //       type: 'line',
    //       yAxisIndex: 1,
    //       data: [...itens.map(item => parseFloat(((new Date().getTime() - item.value[1]) / 1000 / 60 / 60).toString()).toFixed(2))]
    //     }
    //   );
    // }

    // if (itens[0].value[2]) {
    //   yAxis.push({
    //     type: 'value',
    //     name: 'Mínimo',
    //     position: 'right',
    //     alignTicks: true,
    //     offset: 5,
    //     axisLine: {
    //       show: true,
    //       lineStyle: {
    //         color: colors[1]
    //       }
    //     },
    //     axisLabel: {
    //       formatter: '{value} h'
    //     }
    //   });

    //   series.push(
    //     {
    //       name: 'Tempo Máximo de Espera',
    //       type: 'line',
    //       yAxisIndex: 2,
    //       data: [...itens.map(item => parseFloat(((new Date().getTime() - item.value[2]) / 1000 / 60 / 60).toString()).toFixed(2))]
    //     }
    //   );
    // }

    const chartBarVerticalOption: EChartOption = {
      color: colors,
      title: {
        subtext: this.showCaption ? this.subtext : "",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        right: "15%",
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            color: "#FFFFFF",
            fontSize: 10,
            show: true,
          },
          // prettier-ignore
          data: [...yAxisData],
        },
      ],
      yAxis: [...yAxis],
      series: [...series],
    };

    this.chart.setOption(chartBarVerticalOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }

  dispatch(value: string): void {
    if (this.actual === ChartBarVerticalComponent.CATEGORY) {
      this.actual = ChartBarVerticalComponent.ITEM;
      this.subtext = "Itens";
    } else {
      this.actual = ChartBarVerticalComponent.CATEGORY;
      this.subtext = "Categoria";
    }

    this.clickBarVerticalEvent.emit({ to: this.actual, value });
  }

  categorySelected(value: string): void {
    if (this.actual === ChartBarVerticalComponent.CATEGORY) {
      this.actual = ChartBarVerticalComponent.ITEM;
      this.subtext = "Itens";
    }

    this.clickBarVerticalEvent.emit({ to: this.actual, value });
  }
}
