import { SingleDataStatistics } from "../../../../order/components/order-productivity/order-productivity.component";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";
import { TOOLBOX } from "../../charts.component";

@Component({
  selector: "app-chart-bar-horizontal",
  templateUrl: "./chart-bar-horizontal.component.html",
})
export class ChartBarHorizontalComponent implements OnInit {
  @ViewChild("chartBarCanvas", { static: true })
  chartBarCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  ngOnInit(): void {
    this.initChart();
    window.addEventListener("resize", () => this.chart.resize());
  }

  initChart(): void {
    this.chart = echarts.init(this.chartBarCanvas.nativeElement);
  }

  configureChart(itens: any[]): void {
    this.clearChart();

    const yAxisData = itens.map((item) => item.category);
    const seriesData = itens.map((item) => item.quantity);

    const chartBarOption: EChartOption = {
      color: ["#61A0A8", "#C23531"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
          color: "#FFF",
        },
      },
      yAxis: {
        type: "category",
        data: [...yAxisData],
        axisLabel: {
          color: "#FFF",
        },
      },
      series: [
        {
          type: "bar",
          data: [...seriesData],
          label: {
            show: true,
            position: "right",
            color: "#FFF",
          },
        },
      ],
    };

    this.chart.setOption(chartBarOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }
}
