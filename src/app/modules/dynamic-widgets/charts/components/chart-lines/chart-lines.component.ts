import { SingleDataStatistics } from "../../../../order/components/order-productivity/order-productivity.component";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";
import { TOOLBOX } from "../../charts.component";

@Component({
  selector: "app-chart-lines",
  templateUrl: "./chart-lines.component.html",
})
export class ChartLinesComponent implements OnInit {
  @ViewChild("chartLinesCanvas", { static: true })
  chartLinesCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  ngOnInit(): void {
    this.initChart();
    window.addEventListener("resize", () => this.chart.resize());
  }

  initChart(): void {
    this.chart = echarts.init(this.chartLinesCanvas.nativeElement);
  }

  configureChart(itens: SingleDataStatistics[]): void {
    this.clearChart();

    const labels = itens.map((item) => item.label);
    const series = {
      type: "line",
      data: itens.map((item) => item.value),
      label: {
        normal: {
          show: false,
          position: "left",
          textStyle: { color: "#fff" },
        },
      },
    };

    const chartLinesOption: EChartOption = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
        nameTextStyle: {
          fontWeight: "bold",
          color: "#fff",
        },
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: "#fff",
          },
        },
        axisLabel: <any>{
          textStyle: {
            color: "#fff",
          },
          rotate: 90,
        },
      },
      yAxis: {
        type: "value",
        nameTextStyle: {
          fontWeight: "bold",
          color: "#fff",
        },
        axisLine: {
          onZero: true,
          show: true,
          lineStyle: {
            color: "#fff",
          },
        },
        axisLabel: <any>{
          textStyle: {
            color: "#fff",
          },
          rotate: 90,
        },
      },
      series: [series],
    };

    this.chart.setOption(chartLinesOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }
}
