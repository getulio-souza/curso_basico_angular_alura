import { SingleDataStatistics } from "../../../../order/components/order-productivity/order-productivity.component";
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";
@Component({
  selector: "app-chart-pizza",
  templateUrl: "./chart-pizza.component.html",
})
export class ChartPizzaComponent implements OnInit {
  private static CATEGORY = "category";
  private static WARD = "ward";
  private static ITEM = "item";

  private actual = ChartPizzaComponent.CATEGORY;

  @Output() clickPizzaEvent: EventEmitter<{ to: string; value: any }> =
    new EventEmitter<{ to: string; value: any }>();
  @ViewChild("chartPizzaCanvas", { static: true })
  chartPizzaCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  private subtext: string = "Categoria";
  private filterCache: string = null;

  ngOnInit(): void {
    this.initChart();
    window.addEventListener("resize", () => this.chart.resize());

    this.chart.on("click", (handler) => {
      if (this.actual === ChartPizzaComponent.CATEGORY) {
        this.actual = ChartPizzaComponent.WARD;
        this.subtext = "Ala / Departamento";
        this.filterCache = `${handler.name}`;
      } else if (this.actual === ChartPizzaComponent.WARD) {
        this.actual = ChartPizzaComponent.ITEM;
        this.subtext = "Itens";
        this.filterCache = `${this.filterCache} > ${handler.name}`;
      } else if (this.actual === ChartPizzaComponent.ITEM) {
        this.actual = ChartPizzaComponent.CATEGORY;
        this.subtext = "Categoria";
        this.filterCache = null;
      }
      this.clickPizzaEvent.emit({ to: this.actual, value: handler.name });
    });
  }

  initChart(): void {
    this.chart = echarts.init(this.chartPizzaCanvas.nativeElement);
  }

  async configureChart(itens: SingleDataStatistics[]): Promise<void> {
    this.clearChart();

    const series = itens.map((item) =>
      Object.assign(
        {},
        { name: item.label, value: item.value[0], label: { color: "#FFFFFF" } }
      )
    );

    const chartPizzaOption: EChartOption = {
      title: {
        text: this.subtext,
        right: "right",
        textStyle: {
          color: "#FFFFFF",
          fontSize: 15,
        },
        subtext: this.filterCache,
        subtextStyle: {
          color: "#CCCCCC",
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#FFFFFF",
        },
      },
      series: [
        {
          name: "Quantidade",
          type: "pie",
          radius: "70%",
          data: [...series],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    this.chart.setOption(chartPizzaOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }
}
