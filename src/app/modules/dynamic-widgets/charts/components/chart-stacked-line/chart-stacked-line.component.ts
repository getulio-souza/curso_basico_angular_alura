import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { EChartOption } from "echarts";
import * as echarts from 'echarts';

@Component({
    selector: 'app-chart-stacked-line',
    templateUrl: './chart-stacked-line.component.html',
})
export class ChartStackedLineComponent implements OnInit {
    @ViewChild('chartStackedLine', { static: true }) chartStackedLine: ElementRef<HTMLDivElement>;

    private chart: echarts.ECharts;

    ngOnInit(): void {
        this.initChart();
        window.addEventListener('resize', () => this.chart.resize());
    }

    initChart(): void {
        this.chart = echarts.init(this.chartStackedLine.nativeElement);
    }

    configureChart(itens: any[]): void {
        this.clearChart();

        const series = [
            ...itens.map(item => Object.assign({}, 
                {
                    name: item.item,
                    type: 'line',
                    data: [
                        item.periods.get('0.5'),
                        item.periods.get('1'),
                        item.periods.get('1.5'),
                        item.periods.get('2'),
                        item.periods.get('2.5'),
                        item.periods.get('3'),
                        item.periods.get('3.5'),
                        item.periods.get('4'),
                        item.periods.get('4.5'),
                        item.periods.get('5'),
                        item.periods.get('5.5'),
                        item.periods.get('6'),
                        item.periods.get('6.5'),
                        item.periods.get('7'),
                        item.periods.get('7.5'),
                        item.periods.get('8'),
                        item.periods.get('8.5'),
                        item.periods.get('9'),
                        item.periods.get('9.5'),
                        item.periods.get('10'),
                        item.periods.get('+10')
                    ]
                }
            ))
        ];

        const chartBarOption: EChartOption = {

            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [
                    '0:30', 
                    '01:00', 
                    '01:30', 
                    '02:00', 
                    '02:30', 
                    '03:00', 
                    '03:30', 
                    '04:00', 
                    '04:30', 
                    '05:00', 
                    '05:30', 
                    '06:00', 
                    '06:30', 
                    '07:00', 
                    '07:30', 
                    '08:00', 
                    '08:30', 
                    '09:00', 
                    '09:30', 
                    '10:00', 
                    '+10:00'
                ],
                axisLabel: {
                    color: '#FFF'
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#FFF'
                }
            },
            series: [...series]
        };

        this.chart.setOption(chartBarOption);
        this.chart.resize();
    }

    clearChart() {
        this.chart.clear();
        this.chart.resize();
    }
}