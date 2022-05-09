import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from 'echarts';
import { TOOLBOX } from "../../charts.component";

@Component({
    selector: 'app-chart-gauge',
    templateUrl: './chart-gauge.component.html',
    // styleUrls: ['./homePage2.component.scss']
})
export class ChartGaugeComponent implements OnInit {
    @ViewChild('chartGaugeCanvas', { static: true }) chartGaugeCanvas: ElementRef<HTMLDivElement>;

    private chart: echarts.ECharts;

    ngOnInit(): void {
        this.initChart();
        window.addEventListener('resize', () => this.chart.resize());
    }

    initChart(): void {
        this.chart = echarts.init(this.chartGaugeCanvas.nativeElement);
    }

    configureChart(value: number): void {
        const chartGaugeOption: EChartOption = {
            color: ['#00dca9', '#0b9b7c', '#117764', '#156357', '#175950'],
            toolbox: TOOLBOX,
            series: [
                {
                    type: 'gauge',
                    min: 100,
                    max: 0,
                    axisLine: {
                        lineStyle: {
                            width: 18,
                            color: [
                                [0.3, '#FF2D00'],
                                [0.8, '#B6B6B6'],
                                [1, '#2BDB38']
                            ]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: 10,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: 15,
                        color: '#999',
                        fontSize: 10
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        fontSize: 35,
                        offsetCenter: [0, '70%'],
                        formatter: '{value} min',
                    },
                    data: [
                        {
                            value: Math.round(this.verifyPercentageBasedToOneHour(value))
                        }
                    ]
                }
            ]
        };

        this.chart.setOption(chartGaugeOption);
        this.chart.resize();
    }

    verifyPercentageBasedToOneHour(value: number): number {
        return value;
    }
}