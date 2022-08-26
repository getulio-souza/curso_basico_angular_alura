import { ChartsObservable } from "./../../charts.observable";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";

@Component({
  selector: "app-chart-bar-vertical-simple",
  templateUrl: "./chart-bar-vertical-simple.component.html",
})
export class ChartBarVerticalSimpleComponent implements OnInit {
  @ViewChild("chartBarVerticalSimple", { static: true })
  chartBarVerticalSimple: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

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
  }

  initChart(): void {
    this.chart = echarts.init(this.chartBarVerticalSimple.nativeElement);
  }

  configureChart(itens: any[]): void {
    this.clearChart();

    const colors = ["#D48265", "#61A0A8", "#C23531"];
    const yAxisData = itens.map((item) => item.category);

    const series = [];
    series.push({
      name: "Quantidade",
      type: "bar",
      data: [...itens.map((item) => item.quantity)],
      label: {
        show: true,
        position: "top",
        color: "#FFF",
      },
    });

    const chartBarOption: EChartOption = {
      color: colors,
      tooltip: {
        show: true,
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
            color: "#FFF",
            fontSize: 10,
            show: true,
          },
          data: [...yAxisData],
        },
      ],
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#FFF",
          },
        },
      },
      series: [...series],
    };

    this.chart.setOption(chartBarOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }
}
