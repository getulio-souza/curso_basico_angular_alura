import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from "echarts";
import { TOOLBOX } from "../../charts.component";
import { SingleDataStatistics } from "../../../../order/components/order-productivity/order-productivity.component";

@Component({
  selector: "app-chart-funnel",
  templateUrl: "./chart-funnel.component.html",
})
export class ChartFunnelComponent implements OnInit {
  @ViewChild("chartFunnelCanvas", { static: true })
  chartFunnelCanvas: ElementRef<HTMLDivElement>;

  private chart: echarts.ECharts;

  ngOnInit(): void {
    this.initChart();
    window.addEventListener("resize", () => this.chart.resize());
  }

  initChart(): void {
    this.chart = echarts.init(this.chartFunnelCanvas.nativeElement);
  }

  configureChart(itens: SingleDataStatistics[]) {
    this.clearChart();

    const types = itens.map((item) => item.label);
    const totalData = itens
      .map((item) => item.value[0])
      .reduce((prv, crt) => prv + crt);
    const data = itens.map((item) =>
      Object.assign(
        {},
        {
          name: item.label,
          value: this.getPerccentage(totalData, item.value[0]),
        }
      )
    );

    const chartFunnelOption: EChartOption = {
      color: ["#a06000", "#00a1ff", "#005ea0"],
      toolbox: TOOLBOX,
      title: {
        text: "",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}%",
      },
      legend: {
        data: types,
      },
      series: [
        {
          name: "Funnel",
          type: "funnel",
          left: "10%",
          top: 60,
          bottom: 60,
          width: "80%",
          min: 0,
          max: 100,
          minSize: "0%",
          maxSize: "100%",
          sort: "descending",
          gap: 2,
          label: {
            show: true,
            position: "inside",
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: "solid",
            },
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: data,
        },
      ],
    };

    this.chart.setOption(chartFunnelOption);
    this.chart.resize();
  }

  clearChart() {
    this.chart.clear();
    this.chart.resize();
  }

  getPerccentage(total: number, comp: number) {
    return Math.round((comp * 100) / total);
  }
}
