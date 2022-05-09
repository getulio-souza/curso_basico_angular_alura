import { EChartOption } from "echarts";

export class OrderChartsConstants {

  static getPieChartOptions(data: { name: string, value: number }[]): EChartOption {
    const option: EChartOption = {
      color: OrderChartsConstants.COLORS,
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      }, series: [{
        type: 'pie',
        radius: '50%',
        labelLine: {
          show: false,
          length: 8,
          length2: 12
        }, label: {
          textStyle: {
            color: OrderChartsConstants.COLOR_FONT
          }
        }, data: data
      }]
    };
    return option;
  }

  static getBarChartOptions(data: { name: string, value: number }[], line?: { name: string, value: number }[]): EChartOption {
    const option: EChartOption = {
      color: OrderChartsConstants.COLORS,
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: true, title: 'data', lang: ['data', 'back'] },
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
      },
      xAxis: [{
        type: 'category',
        data: data.map(item => item.name),
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: <any>{
          textStyle: {
            color: OrderChartsConstants.COLOR_FONT,
          }
        },
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          lineStyle: { color: OrderChartsConstants.COLOR_FONT }
        }
      }],
      series: [<any>{
        type: 'bar',
        data: data.map(item => item.value),
        barMaxWidth: '20'
      }]
    };

    if (line != null) {
      option.series.push({
        type: 'line',
        data: line
      });
    }

    return option;
  }

  static COLORS = ['#00dca9', '#0b9b7c', '#117764', '#156357', '#175950'];
  static COLORS_RED = ['#e45454'];

  static COLOR_FONT = '#fff';

}