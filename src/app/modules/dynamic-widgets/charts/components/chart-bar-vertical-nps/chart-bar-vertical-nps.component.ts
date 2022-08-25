import { ChartsObservable } from "./../../charts.observable";
import { SingleDataStatistics } from "../../../../order/components/produtividade/produtividade.component";
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
  selector: "app-chart-bar-vertical-nps",
  templateUrl: "./chart-bar-vertical-nps.component.html",
})
export class ChartBarVerticalNpsComponent implements OnInit {
  private static CATEGORY = "category";
  private static ITEM = "item";

  @Output() clickBarVerticalNpsEvent: EventEmitter<{ to: string; value: any }> =
    new EventEmitter<{ to: string; value: any }>();
  @Output() restoreVerticalEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild("chartBarVerticalNpsCanvas", { static: true })
  chartBarVerticalNpsCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  private actual = ChartBarVerticalNpsComponent.CATEGORY;
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
      this.actual = ChartBarVerticalNpsComponent.CATEGORY;
      this.subtext = "Categoria";
      this.restoreVerticalEvent.emit();
    });
  }

  initChart(): void {
    this.chart = echarts.init(this.chartBarVerticalNpsCanvas.nativeElement);
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
        position: "left",
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
            fontFamily: "FontAwesome",
          },
        },
        axisLabel: {
          formatter: "{value}",
          color: "#FFF",
          fontFamily: "FontAwesome",
        },
      });

      series.push({
        type: "bar",
        data: [...itens.map((item) => item.value[0])],
        label: {
          show: true,
          position: "top",
          color: "#FFF",
        },
      });
    }

    const chartBarVerticalNpsOption: EChartOption = {
      color: colors,
      tooltip: {
        trigger: "axis",
        textStyle: {
          fontFamily: "FontAwesome",
        },
      },
      grid: {
        right: "15%",
      },
      xAxis: [
        {
          type: "category",
          data: ["\uf118", "\uf119"],
          axisPointer: {
            type: "shadow",
          },
          axisLabel: <any>{
            color: "#FFFFFF",
            fontSize: 24,
            fontFamily: "FontAwesome",
          },
        },
      ],
      yAxis: [...yAxis],
      series: [...series],
    };

    this.chart.setOption(chartBarVerticalNpsOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }

  dispatch(value: string): void {
    if (this.actual === ChartBarVerticalNpsComponent.CATEGORY) {
      this.actual = ChartBarVerticalNpsComponent.ITEM;
      this.subtext = "Itens";
    } else {
      this.actual = ChartBarVerticalNpsComponent.CATEGORY;
      this.subtext = "Categoria";
    }

    this.clickBarVerticalNpsEvent.emit({ to: this.actual, value });
  }

  categorySelected(value: string): void {
    if (this.actual === ChartBarVerticalNpsComponent.CATEGORY) {
      this.actual = ChartBarVerticalNpsComponent.ITEM;
      this.subtext = "Itens";
    }

    this.clickBarVerticalNpsEvent.emit({ to: this.actual, value });
  }
}
