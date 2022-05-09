import {Injectable} from '@angular/core';
import {Consumption, Presence} from '@alis/proxper-base';
import { OrderEvent } from '../../modules/order/model/order-event';

@Injectable()
export class FakeDataService {

  constructor() {
  }


  getConsumptionList(dataParams): Consumption[] {
    // resolution: resolution,
    // period: period,
    // periodEntries: periodEntries

    if (dataParams['resolution'] === 'day' && dataParams['period'] === 'DAY_OF_WEEK' && !dataParams['periodentries']) {
      // summary week;
      return JSON.parse(this.getSummaryByWeek());
    } else if (dataParams['resolution'] === 'month' && !dataParams['period'] && !dataParams['periodentries']) {
      return JSON.parse(this.getAllMonthsFrom2017());
    } else if (dataParams['resolution'] === 'day' && !dataParams['period'] && !dataParams['periodentries']) {
      return JSON.parse(this.getAllDaysFromJan());
    } else if (dataParams['resolution'] === 'hour' && !dataParams['period'] && !dataParams['periodentries']) {
      return JSON.parse(this.getAllHoursFromJan1());
    } else if (dataParams['resolution'] === 'hour' && dataParams['period'] === 'DAY_OF_WEEK' && dataParams['periodentries'] === '1') {
      return JSON.parse(this.getAllHoursFromJan1());
    }

    return new Array();
  }

  getPresenceList(dataParams): Presence[] {

    if (dataParams['resolution'] === 'day' && !dataParams['periodentries'] && !dataParams['period']) {
      return JSON.parse(this.getPresenceFromCurrentMonth());
    } else if (!dataParams['periodentries'] && dataParams['period'] === 'DAY_OF_WEEK') {
      return JSON.parse(this.getPresenceByWeek());
    } else if (dataParams['periodentries'] && dataParams['period'] === 'DAY_OF_WEEK' && dataParams['resolution'] === 'hour') {
      return JSON.parse(this.getPresenceByHour());
    } else if (dataParams['resolution'] === 'hour' && !dataParams['period'] && !dataParams['periodentries']) {
      return JSON.parse(this.getPresenceByHour());
    } else if (dataParams['resolution'] === 'month') {
      return JSON.parse(this.getPresenceFromAllMonths2017());
    }
    return new Array();
  }

  private getPresenceFromAllMonths2017(): string {

    return `
            [
                {"AverageRunTime": 18000000, "count": 17, "result": 1483236000000},
                {"AverageRunTime": 42000000, "count": 17, "result": 1485914400000},
                {"AverageRunTime": 15000000, "count": 17, "result": 1488337200000},
                {"AverageRunTime": 12000000, "count": 17, "result": 1491015600000},
                {"AverageRunTime": 25000000, "count": 17, "result": 1493607600000},
                {"AverageRunTime": 40000000, "count": 17, "result": 1496286000000},
                {"AverageRunTime": 25000000, "count": 17, "result": 1498878000000},
                {"AverageRunTime": 15000000, "count": 17, "result": 1501556400000},
                {"AverageRunTime": 12000000, "count": 17, "result": 1504234800000},
                {"AverageRunTime": 25000000, "count": 17, "result": 1506826800000},
                {"AverageRunTime": 25000000, "count": 17, "result": 1509501600000},
                {"AverageRunTime": 25000000, "count": 17, "result": 1512093600000}
            ]
       `;

  }

  private getPresenceFromCurrentMonth(): string {
    return `
        [
            {"AverageRunTime": 18000000, "count": 17, "result": 1483365600000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1483452000000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483538400000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483624800000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483711200000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1483797600000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483884000000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1483970400000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1484056800000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1484143200000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1484229600000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1484316000000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1484402400000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1484488800000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1484575200000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1484661600000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1484748000000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1484834400000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1484920800000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1485007200000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1485093600000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1485180000000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1485266400000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1485352800000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1485439200000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1485525600000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1485612000000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1485698400000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1485784800000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1485871200000}
        ]`;
  }

  private getPresenceByHour(): string {
    return `
        [
            {"AverageRunTime": 18000000, "count": 17, "result": 1483322400000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1483326000000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483329600000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483333200000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483336800000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1483340400000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483344000000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1483347600000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1483347600000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483351200000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483354800000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483358400000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1483362000000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483365600000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1483369200000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1483372800000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483376400000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483380000000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483383600000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1483387200000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483390800000},
            {"AverageRunTime": 18000000, "count": 17, "result": 1483394400000},
            {"AverageRunTime": 42000000, "count": 17, "result": 1483398000000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483401600000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483405200000}
        ]`;

  }

  private getPresenceByWeek() {
    return `
        [
            {"AverageRunTime": 42000000, "count": 17, "result": 1483327222000},
            {"AverageRunTime": 15000000, "count": 17, "result": 1483413622000},
            {"AverageRunTime": 12000000, "count": 17, "result": 1483500022000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483586422000},
            {"AverageRunTime": 40000000, "count": 17, "result": 1483672822000},
            {"AverageRunTime": 25000000, "count": 17, "result": 1483759222000},
             {"AverageRunTime": 18000000, "count": 17, "result": 1483240822000}

        ]`;
  }

  private getSummaryByWeek(): string {
    return ` [
        {"Resolution": "day", "result": 1483365600000, "runtime": 62.093, "savingsRuntime": 6.093, "Kwh": 62.093,"SavingsKwh": 6.093,"Price": 234.0,"SavingsPrice": 100.00},
        {"Resolution": "day", "result": 1483452000000, "runtime": 58.992, "savingsRuntime": 5.992, "Kwh": 58.992,"SavingsKwh": 5.992,"Price": 234.0,"SavingsPrice": 100.00},
        {"Resolution": "day", "result": 1483538400000, "runtime": 67.134, "savingsRuntime": 6.134, "Kwh": 67.134,"SavingsKwh": 6.134,"Price": 234.0,"SavingsPrice": 100.00},
        {"Resolution": "day", "result": 1483624800000, "runtime": 65.334, "savingsRuntime": 6.334, "Kwh": 65.334,"SavingsKwh": 6.334,"Price": 234.0,"SavingsPrice": 100.00},
        {"Resolution": "day", "result": 1483711200000, "runtime": 20.705, "savingsRuntime": 2.705, "Kwh": 20.705,"SavingsKwh": 2.705,"Price": 234.0,"SavingsPrice": 100.00},
        {"Resolution": "day", "result": 1483797600000, "runtime": 85.210, "savingsRuntime": 8.210, "Kwh": 85.210,"SavingsKwh": 8.210,"Price": 234.0,"SavingsPrice": 100.00},
         {"Resolution": "day", "result": 1483884000000, "runtime": 49.630, "savingsRuntime": 4.630, "Kwh": 49.630,"SavingsKwh": 4.630,"Price": 234.0,"SavingsPrice": 100.00}    
    ] `;

  }

  private getAllMonthsFrom2017(): string {
    return `  [
                { "Resolution": "month", "result": 1483236000000, "runtime": 17.91, "savingsRuntime": 1.791, "Kwh": 17.91, "SavingsKwh": 7.91,  "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1485914400000, "runtime": 17.71, "savingsRuntime": 1.771, "Kwh": 17.71, "SavingsKwh": 7.71,  "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1488337200000, "runtime": 21.06, "savingsRuntime": 2.106, "Kwh": 21.06, "SavingsKwh": 11.06, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1491015600000, "runtime": 24.10, "savingsRuntime": 2.410, "Kwh": 24.10, "SavingsKwh": 14.10, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1493607600000, "runtime": 24.41, "savingsRuntime": 2.441, "Kwh": 24.41, "SavingsKwh": 14.41, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1496286000000, "runtime": 24.24, "savingsRuntime": 2.424, "Kwh": 24.24, "SavingsKwh": 14.24, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1498878000000, "runtime": 23.46, "savingsRuntime": 2.346, "Kwh": 23.46, "SavingsKwh": 13.46, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1501556400000, "runtime": 23.91, "savingsRuntime": 2.391, "Kwh": 23.91, "SavingsKwh": 13.91, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1504234800000, "runtime": 29.12, "savingsRuntime": 2.912, "Kwh": 29.12, "SavingsKwh": 19.12, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1506826800000, "runtime": 27.59, "savingsRuntime": 2.759, "Kwh": 27.59, "SavingsKwh": 17.59, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1509501600000, "runtime": 30.07, "savingsRuntime": 3.007, "Kwh": 30.07, "SavingsKwh": 20.07, "Price": 2340.0, "SavingsPrice": 1000.00 },
                { "Resolution": "month", "result": 1512093600000, "runtime": 26.04, "savingsRuntime": 2.604, "Kwh": 26.04, "SavingsKwh": 16.04, "Price": 2340.0, "SavingsPrice": 1000.00 }
            ] `;
  }

  private getAllDaysFromJan() {

    return `  [
                {"Resolution": "day", "key": 1483279200000, "runtime": 72.268, "savingsRuntime": 7.268, "Kwh": 7200.268,"SavingsKwh": 7.268,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483365600000, "runtime": 62.093, "savingsRuntime": 6.093, "Kwh": 6200.093,"SavingsKwh": 6.093,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483452000000, "runtime": 58.992, "savingsRuntime": 5.992, "Kwh": 5800.992,"SavingsKwh": 5.992,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483538400000, "runtime": 67.134, "savingsRuntime": 6.134, "Kwh": 6700.134,"SavingsKwh": 6.134,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483624800000, "runtime": 65.334, "savingsRuntime": 6.334, "Kwh": 6500.334,"SavingsKwh": 6.334,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483711200000, "runtime": 20.705, "savingsRuntime": 2.705, "Kwh": 2000.705,"SavingsKwh": 2.705,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483797600000, "runtime": 85.210, "savingsRuntime": 8.210, "Kwh": 8500.210,"SavingsKwh": 8.210,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483884000000, "runtime": 49.630, "savingsRuntime": 4.630, "Kwh": 4900.630,"SavingsKwh": 4.630,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1483970400000, "runtime": 80.997, "savingsRuntime": 8.997, "Kwh": 8000.997,"SavingsKwh": 8.997,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484056800000, "runtime": 71.345, "savingsRuntime": 7.345, "Kwh": 7100.345,"SavingsKwh": 7.345,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484143200000, "runtime": 70.382, "savingsRuntime": 7.382, "Kwh": 7000.382,"SavingsKwh": 7.382,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484229600000, "runtime": 64.928, "savingsRuntime": 6.928, "Kwh": 6400.928,"SavingsKwh": 6.928,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484316000000, "runtime": 60.945, "savingsRuntime": 6.945, "Kwh": 6000.945,"SavingsKwh": 6.945,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484402400000, "runtime": 60.525, "savingsRuntime": 6.525, "Kwh": 6000.525,"SavingsKwh": 6.525,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484488800000, "runtime": 61.865, "savingsRuntime": 6.865, "Kwh": 6100.865,"SavingsKwh": 6.865,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484575200000, "runtime": 62.792, "savingsRuntime": 6.792, "Kwh": 6200.792,"SavingsKwh": 6.792,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484661600000, "runtime": 71.011, "savingsRuntime": 7.011, "Kwh": 7100.011,"SavingsKwh": 7.011,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484748000000, "runtime": 73.824, "savingsRuntime": 7.824, "Kwh": 7300.824,"SavingsKwh": 7.824,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484834400000, "runtime": 70.034, "savingsRuntime": 7.034, "Kwh": 7000.034,"SavingsKwh": 7.034,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1484920800000, "runtime": 56.474, "savingsRuntime": 5.474, "Kwh": 5600.474,"SavingsKwh": 5.474,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485007200000, "runtime": 53.105, "savingsRuntime": 5.105, "Kwh": 5300.105,"SavingsKwh": 5.105,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485093600000, "runtime": 73.302, "savingsRuntime": 7.302, "Kwh": 7300.302,"SavingsKwh": 7.302,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485180000000, "runtime": 60.940, "savingsRuntime": 6.940, "Kwh": 6000.940,"SavingsKwh": 6.940,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485266400000, "runtime": 58.087, "savingsRuntime": 5.087, "Kwh": 5800.087,"SavingsKwh": 5.087,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485352800000, "runtime": 60.086, "savingsRuntime": 6.086, "Kwh": 6000.086,"SavingsKwh": 6.086,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485439200000, "runtime": 63.517, "savingsRuntime": 6.517, "Kwh": 6300.517,"SavingsKwh": 6.517,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485525600000, "runtime": 56.556, "savingsRuntime": 5.556, "Kwh": 5600.556,"SavingsKwh": 5.556,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485612000000, "runtime": 50.240, "savingsRuntime": 5.240, "Kwh": 5000.240,"SavingsKwh": 5.240,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485698400000, "runtime": 56.392, "savingsRuntime": 5.392, "Kwh": 5600.392,"SavingsKwh": 5.392,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485784800000, "runtime": 64.209, "savingsRuntime": 6.209, "Kwh": 6400.209,"SavingsKwh": 6.209,"Price": 234.0,"SavingsPrice": 100.00},
                {"Resolution": "day", "key": 1485871200000, "runtime": 70.888, "savingsRuntime": 7.888, "Kwh": 7000.888,"SavingsKwh": 7.888,"Price": 234.0,"SavingsPrice": 100.00}

        ] `;

  }

  private getAllHoursFromJan1() {
    return `  [

            {"Resolution": "hour", "result": 1483322400000, "runtime": 1.791,"savingsRuntime": 0.791, "Kwh": 1.791, "SavingsKwh": 0.791,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483326000000, "runtime": 1.771,"savingsRuntime": 0.771, "Kwh": 1.771, "SavingsKwh": 0.771,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483329600000, "runtime": 2.106,"savingsRuntime": 0.106, "Kwh": 2.106, "SavingsKwh": 1.106,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483333200000, "runtime": 2.410,"savingsRuntime": 0.410, "Kwh": 2.410, "SavingsKwh": 1.410,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483336800000, "runtime": 2.441,"savingsRuntime": 0.441, "Kwh": 2.441, "SavingsKwh": 1.441,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483340400000, "runtime": 2.424,"savingsRuntime": 0.424, "Kwh": 2.424, "SavingsKwh": 1.424,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483344000000, "runtime": 2.346,"savingsRuntime": 0.346, "Kwh": 2.346, "SavingsKwh": 1.346,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483347600000, "runtime": 2.391,"savingsRuntime": 0.391, "Kwh": 2.391, "SavingsKwh": 1.391,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483351200000, "runtime": 2.912,"savingsRuntime": 0.912, "Kwh": 2.912, "SavingsKwh": 1.912,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483354800000, "runtime": 2.759,"savingsRuntime": 0.759, "Kwh": 2.759, "SavingsKwh": 1.759,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483358400000, "runtime": 3.007,"savingsRuntime": 0.007, "Kwh": 3.007, "SavingsKwh": 2.007,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483362000000, "runtime": 2.604,"savingsRuntime": 0.604, "Kwh": 2.604, "SavingsKwh": 1.604,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483365600000, "runtime": 2.516,"savingsRuntime": 0.516, "Kwh": 2.516, "SavingsKwh": 1.516,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483369200000, "runtime": 2.745,"savingsRuntime": 0.745, "Kwh": 2.745, "SavingsKwh": 1.745,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483372800000, "runtime": 2.747,"savingsRuntime": 0.747, "Kwh": 2.747, "SavingsKwh": 1.747,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483376400000, "runtime": 3.045,"savingsRuntime": 0.045, "Kwh": 3.045, "SavingsKwh": 2.045,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483380000000, "runtime": 2.616,"savingsRuntime": 0.616, "Kwh": 2.616, "SavingsKwh": 1.616,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483383600000, "runtime": 2.491,"savingsRuntime": 0.491, "Kwh": 2.491, "SavingsKwh": 1.491,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483387200000, "runtime": 2.542,"savingsRuntime": 0.542, "Kwh": 2.542, "SavingsKwh": 1.542,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483390800000, "runtime": 4.870,"savingsRuntime": 0.870, "Kwh": 4.870, "SavingsKwh": 3.870,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483394400000, "runtime": 3.375,"savingsRuntime": 0.375, "Kwh": 3.375, "SavingsKwh": 2.375,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483398000000, "runtime": 2.399,"savingsRuntime": 0.399, "Kwh": 2.399, "SavingsKwh": 1.399,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483401600000, "runtime": 1.908,"savingsRuntime": 0.908, "Kwh": 1.908, "SavingsKwh": 0.908,"Price": 234.0,"SavingsPrice": 100.00},
            {"Resolution": "hour", "result": 1483405200000, "runtime": 1.877,"savingsRuntime": 0.877, "Kwh": 1.877, "SavingsKwh": 0.877,"Price": 234.0,"SavingsPrice": 100.00}
               ] `;

  }

  public getTagConfigByPropertyId(propertyId) {

    return JSON.parse(`{
        "id": "deltixboutiquehotel",
        "name": null,
        "units": [
          {
            "id": "20009",
            "name": "PredioPrincipal",
            "units": [
              {
                "id": "Andar1",
                "name": null,
                "units": [
                  {
                    "id": "10001",
                    "name": null,
                    "units": null,
                    "tags": [
                      "simples",
                      "coluna1"
                    ],
                    "level": 0
                  },
                  {
                    "id": "10002",
                    "name": null,
                    "units": null,
                    "tags": [
                      "simples",
                      "coluna2"
                    ],
                    "level": 0
                  }
                ],
                "tags": [
                  "vip"
                ],
                "level": 1
              },
              {
                "id": "20001",
                "name": "Terraco",
                "units": null,
                "tags": null,
                "level": 0
              },
              {
                "id": "20011",
                "name": "Terreo",
                "units": [
                  {
                    "id": "20002",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20003",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20004",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20005",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20006",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20007",
                    "name": null,
                    "units": null,
                    "tags": null,
                    "level": 0
                  },
                  {
                    "id": "20008",
                    "name": null,
                    "units": null,
                    "tags": [
                      "vip"
                    ],
                    "level": 0
                  }
                ],
                "tags": null,
                "level": 1
              }
            ],
            "tags": null,
            "level": 2
          },
          {
            "id": "20010",
            "name": "PredioAnexo",
            "units": [
              {
                "id": "10003",
                "name": "Quarto 103",
                "units": null,
                "tags": [
                  "duplo",
                  "coluna1"
                ],
                "level": 0
              }
            ],
            "tags": null,
            "level": 2
          }
        ]
      }`);
  }

  public getTraceByTag(tag: string) {

    let roomNumber = parseInt(tag);
    let info = {};


    info['sold'] = Math.random();
    info['occupancy'] = Math.random();
    info['consume'] = Math.random() * 1000;


    return info;


  }

  public getPropertySubdivisionConfig(propertyId: String) {
    return {
      level: 0,
      label: 'Units'
    };
  }

  public getLastAggregationRooms() {

    return [
      {
        'deviceId': 'Dnd.100', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10001', 'privacy': 'do-not-disturb', 'timestamp': 1541859760000,
        'lastStateChanged': 1541859760000, 'engagedTime': 106500000
      },
      {
        'deviceId': 'Dnd.101', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10002', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 72000000
      },
      {
        'deviceId': 'Dnd.102', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20001', 'privacy': 'none', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.103', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20002', 'privacy': 'make-up-room', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.104', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20003', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 89500000
      },
      {
        'deviceId': 'Dnd.105', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20004', 'privacy': 'none', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.106', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20005', 'privacy': 'make-up-room', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.107', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20006', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 54000000
      },
      {
        'deviceId': 'Dnd.108', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20007', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1542118960000, 'engagedTime': 92500000
      },
      {
        'deviceId': 'Dnd.109', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20008', 'privacy': 'none', 'timestamp': 1541859760000,
        'lastStateChanged': 1541859760000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.110', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10003', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1541859760000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.111', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30001', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1541859760000, 'engagedTime': 86500000
      },
      {
        'deviceId': 'Dnd.112', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30002', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1541859760000, 'engagedTime': 96500000
      },
      {
        'deviceId': 'Dnd.113', 'deviceType': 'Dnd', 'ownerName': 'deltixboutiquehotel', 'traceType': 'join_normalized', 'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30003', 'privacy': 'do-not-disturb', 'timestamp': 1542118960000,
        'lastStateChanged': 1541859760000, 'engagedTime': 87500000
      },
      {
        'active-profile': 1,
        'cool-setpoint': 21,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 21,
        'kwh': 0.9013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 21.401674167563513,
        'timestamp': 1541859760000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10001',
        'mode': 'heat',
        'fanspeed': 'low'
      },
      {
        'active-profile': 1,
        'cool-setpoint': 20,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 20,
        'kwh': 2.5013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 20.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10002',
        'mode': 'cool',
        'fanspeed': 'low'
      },
      {
        'active-profile': 1,
        'cool-setpoint': 25,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 25,
        'kwh': 1.5013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 27.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20001',
        'mode': 'cool',
        'fanspeed': 'medium'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 27,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 27,
        'kwh': 0.9013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 29.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20002',
        'mode': 'heat',
        'fanspeed': 'medium'
      },
      {
        'active-profile': 1,
        'cool-setpoint': 22,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 22,
        'kwh': 0.8013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 25.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20003',
        'mode': 'off',
        'fanspeed': 'medium'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 25,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 25,
        'kwh': 0.6013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 26.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20004',
        'mode': 'heat',
        'fanspeed': 'high'
      },
      {
        'active-profile': 1,
        'cool-setpoint': 23,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 23,
        'kwh': 0.5013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 22.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20005',
        'mode': 'off',
        'fanspeed': 'high'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 22,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 22,
        'kwh': 0.6013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 20.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20006',
        'mode': 'heat',
        'fanspeed': 'off'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 27,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 27,
        'kwh': 0.7013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 26.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20007',
        'mode': 'cool',
        'fanspeed': 'high'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 25,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 25,
        'kwh': 0.8013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 25.401674167563513,
        'timestamp': 1541859760000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.20008',
        'mode': 'cool',
        'fanspeed': 'high'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 25,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 25,
        'kwh': 0.6013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 26.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.10003',
        'mode': 'heat',
        'fanspeed': 'high'
      },
      {
        'active-profile': 1,
        'cool-setpoint': 23,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 23,
        'kwh': 0.5013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 22.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30001',
        'mode': 'auto',
        'fanspeed': 'high'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 22,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 22,
        'kwh': 0.6013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': false,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 20.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30002',
        'mode': 'heat',
        'fanspeed': 'off'
      },
      {
        'active-profile': 0,
        'cool-setpoint': 27,
        'deviceId': 'Telkonet.000A8000FC000598.thermostat',
        'deviceType': 'Thermostat',
        'elapsedTime': 600000,
        'heat-setpoint': 27,
        'kwh': 0.7013720833333334,
        'ownerName': 'deltixboutiquehotel',
        'presence': true,
        'presenceTime': 600000,
        'price': 0.19232131744583333,
        'runtime': 515697,
        'savingsKwh': 0,
        'savingsPrice': 0,
        'savingsRuntime': 0,
        'tag': 'predioPrincipal',
        'temperature': 26.401674167563513,
        'timestamp': 1542118960000,
        'traceType': 'join_normalized',
        'type': 'attrs',
        'unitName': 'deltixboutiquehotel.30003',
        'mode': 'auto',
        'fanspeed': 'high'
      },
    ];

  }

  public getFakeRoomsSummaryData(floorId) {

    let response = [];

    if (floorId == 'deltixboutiquehotel.andar1') {
      response = [
        {
          'id': '10002',
          'name': 'Quarto 102',
          'temperature': 25,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'off'
        },
        {
          'id': '10003',
          'name': 'Quarto 103',
          'temperature': 21,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10004',
          'name': 'Quarto 104',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10005',
          'name': 'Quarto 105',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10006',
          'name': 'Quarto 106',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10007',
          'name': 'Quarto 107',
          'temperature': 24,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10008',
          'name': 'Quarto 108',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10009',
          'name': 'Quarto 109',
          'temperature': 22,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10010',
          'name': 'Quarto 110',
          'temperature': 30,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'off'
        },
        {
          'id': '10011',
          'name': 'Quarto 111',
          'temperature': 32,
          'setpoint': '25',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        }
      ];
    } else if (floorId == 'deltixboutiquehotel.andar2') {
      response = [
        {
          'id': '10012',
          'name': 'Quarto 112',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10013',
          'name': 'Quarto 113',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10014',
          'name': 'Quarto 114',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10015',
          'name': 'Quarto 115',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10016',
          'name': 'Quarto 116',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10017',
          'name': 'Quarto 117',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'auto'
        },
        {
          'id': '10018',
          'name': 'Quarto 118',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10019',
          'name': 'Quarto 119',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10020',
          'name': 'Quarto 120',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10021',
          'name': 'Quarto 121',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        }

      ];
    } else if (floorId == 'deltixboutiquehotel.andar3') {
      response = [
        {
          'id': '10022',
          'name': 'Quarto 122',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10023',
          'name': 'Quarto 123',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10024',
          'name': 'Quarto 124',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10025',
          'name': 'Quarto 125',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'off'
        },
        {
          'id': '10026',
          'name': 'Quarto 126',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10027',
          'name': 'Quarto 127',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10028',
          'name': 'Quarto 128',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10029',
          'name': 'Quarto 129',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10030',
          'name': 'Quarto 130',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10031',
          'name': 'Quarto 131',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'auto'
        },
        {
          'id': '10042',
          'name': 'Quarto 142',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10043',
          'name': 'Quarto 143',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10044',
          'name': 'Quarto 144',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10045',
          'name': 'Quarto 145',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'heat'
        },
        {
          'id': '10046',
          'name': 'Quarto 146',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10047',
          'name': 'Quarto 147',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10048',
          'name': 'Quarto 148',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10049',
          'name': 'Quarto 149',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10050',
          'name': 'Quarto 150',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10051',
          'name': 'Quarto 151',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        }

      ];
    } else if (floorId == 'deltixboutiquehotel.andar4') {
      return [

        {
          'id': '10052',
          'name': 'Quarto 152',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'off'
        },
        {
          'id': '10053',
          'name': 'Quarto 153',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10054',
          'name': 'Quarto 154',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'off'
        },
        {
          'id': '10055',
          'name': 'Quarto 155',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10056',
          'name': 'Quarto 156',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'heat'
        },
        {
          'id': '10057',
          'name': 'Quarto 157',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10058',
          'name': 'Quarto 158',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10059',
          'name': 'Quarto 159',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'heat'
        },
        {
          'id': '10060',
          'name': 'Quarto 160',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10061',
          'name': 'Quarto 161',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'cool'
        },


        {
          'id': '10062',
          'name': 'Quarto 162',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'heat'
        },
        {
          'id': '10063',
          'name': 'Quarto 163',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10064',
          'name': 'Quarto 164',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10065',
          'name': 'Quarto 165',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10066',
          'name': 'Quarto 166',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'off'
        },
        {
          'id': '10067',
          'name': 'Quarto 167',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'heat'
        },
        {
          'id': '10068',
          'name': 'Quarto 168',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10069',
          'name': 'Quarto 169',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10070',
          'name': 'Quarto 170',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10071',
          'name': 'Quarto 171',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },

        {
          'id': '10082',
          'name': 'Quarto 182',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10083',
          'name': 'Quarto 183',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10084',
          'name': 'Quarto 184',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10085',
          'name': 'Quarto 185',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10086',
          'name': 'Quarto 186',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10087',
          'name': 'Quarto 187',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10088',
          'name': 'Quarto 188',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'off'
        },
        {
          'id': '10089',
          'name': 'Quarto 189',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10090',
          'name': 'Quarto 190',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10091',
          'name': 'Quarto 191',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'auto'
        },

        {
          'id': '10092',
          'name': 'Quarto 192',
          'temperature': 20,
          'setpoint': '23',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10093',
          'name': 'Quarto 193',
          'temperature': 17,
          'setpoint': '24',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'cool'
        },
        {
          'id': '10094',
          'name': 'Quarto 194',
          'temperature': 17,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10095',
          'name': 'Quarto 195',
          'temperature': 28,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'medium',
          'mode': 'off'
        },
        {
          'id': '10096',
          'name': 'Quarto 196',
          'temperature': 25,
          'setpoint': '28',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'cool'
        },
        {
          'id': '10097',
          'name': 'Quarto 197',
          'temperature': 22,
          'setpoint': '20',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'low',
          'mode': 'heat'
        },
        {
          'id': '10098',
          'name': 'Quarto 198',
          'temperature': 23,
          'setpoint': '23',
          'active-profile': true,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'auto'
        },
        {
          'id': '10099',
          'name': 'Quarto 199',
          'temperature': 25,
          'setpoint': '17',
          'active-profile': true,
          'presence': false,
          'fanspeed': 'low',
          'mode': 'cool'
        },
        {
          'id': '10100',
          'name': 'Quarto 200',
          'temperature': 35,
          'setpoint': '22',
          'active-profile': false,
          'presence': true,
          'fanspeed': 'medium',
          'mode': 'heat'
        },
        {
          'id': '10101',
          'name': 'Quarto 201',
          'temperature': 21,
          'setpoint': '25',
          'active-profile': false,
          'presence': false,
          'fanspeed': 'high',
          'mode': 'off'
        }
      ];
    }

    if (response.length == 0) {
      console.log('could not reconized floorId: ' + floorId + ' in fake data service');
    }
    return response;
  }

  public getFakeEventsCard() {
    return [
      {id: 1, value: 3320, color: '#26c6da', average: 1123, status: 'open'},
      {id: 2, value: 32, color: '#b9d01a', average: 27, status: 'in progress'},
      {id: 3, value: 200, color: '#e84d4d', average: 10, status: 'pending'},
      {id: 4, value: 1000, color: '#00dca9', average: 112, status: 'done'}
    ];
  }

  public getFakeEventsListByStatus(type: string) {

    switch (type) {
      case 'open':
        return [
          {status: '#26c6da', location: 201, description: 'no', timestamp: 1557503258000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557589658000},
          {status: '#26c6da', location: 201, description: 'no', timestamp: 1557589658000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557589658000},
          {status: '#26c6da', location: 201, description: 'no', timestamp: 1557589658000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557589658000},
          {status: '#26c6da', location: 201, description: 'no', timestamp: 1557586238000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557582638000},
          {status: '#26c6da', location: 201, description: 'no', timestamp: 1557581238000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557581538000},
          {status: '#26c6da', location: 201, description: 'no', timestamp:  1557581738000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557585038000},
          {status: '#26c6da', location: 201, description: 'no', timestamp:  1557582038000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557589938000},
          {status: '#26c6da', location: 201, description: 'no', timestamp:  1557588038000},
          {status: '#26c6da', location: 202, description: 'yes', timestamp: 1557586038000}
        ];
      case 'in progress':
        return [
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557503258000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557586238000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557582638000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557581238000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557581538000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557581738000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557585038000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557582038000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589938000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557588038000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557586038000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557503258000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#b9d01a', location: 201, description: 'yes', timestamp: 1557586238000},
          {status: '#b9d01a', location: 202, description: 'no', timestamp: 1557582638000}
        ];
      case 'pending':
        return [
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557503258000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557586238000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557582638000},
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557581238000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557581538000},
          {status: '#e84d4d', location: 201, description: 'no', timestamp: 1557581738000},
          {status: '#e84d4d', location: 202, description: 'yes', timestamp: 1557585038000},
          {status: '#e84d4d', location: 201, description: 'no', timestamp: 1557582038000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557589938000},
          {status: '#e84d4d', location: 201, description: 'yes', timestamp: 1557588038000},
          {status: '#e84d4d', location: 202, description: 'no', timestamp: 1557586038000}
        ];
      case 'done':
        return [
          {status: '#00dca9', location: 201, description: 'yes', timestamp: 1557503258000},
          {status: '#00dca9', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#00dca9', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#00dca9', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#00dca9', location: 201, description: 'yes', timestamp: 1557589658000},
          {status: '#00dca9', location: 202, description: 'no', timestamp: 1557589658000},
          {status: '#00dca9', location: 201, description: 'yes', timestamp: 1557586238000},
          {status: '#00dca9', location: 202, description: 'no', timestamp: 1557582638000},
          {status: '#00dca9', location: 201, description: 'yes', timestamp: 1557581238000},
          {status: '#00dca9', location: 202, description: 'yes', timestamp: 1557581538000},
          {status: '#00dca9', location: 201, description: 'no', timestamp: 1557581738000},
          {status: '#00dca9', location: 202, description: 'yes', timestamp: 1557585038000},
          {status: '#00dca9', location: 201, description: 'no', timestamp: 1557582038000},
          {status: '#00dca9', location: 202, description: 'yes', timestamp: 1557589938000}
        ];
      default:
        console.log('Não foram encontrados valores para type --> ', type);
    }
  }

  public  getFakeDeviceList(type: string) {

    switch (type) {
      case 'tvs':
        return [
          {icon: 'tv', deviceName: 'TV - living room', room: '100', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '110', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room ', room: '204', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '206', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '301', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '304', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '401', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '400', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '203', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'}
        ];
      case 'thermostats':
        return[
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '101', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '202', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '305', timestamp: 1557581738000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '401', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '502', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '601', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '602', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '603', timestamp: 1557581738000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '604', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '605', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
        ];
      case 'curtains':
        return [
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '204', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '203', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '201', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '200', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '301', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '302', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '601', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '602', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '701', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '702', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
        ];
      case 'lightings':
        return [
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room ceiling',      room: '111', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - lighting washbasin',       room: '110', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - doctors light',    room: '201', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - bathroom light',  room: '304', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room',      room: '305', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room ceiling',      room: '411', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - lighting washbasin',       room: '410', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - doctors light',    room: '501', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - bathroom light',  room: '502', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room',      room: '506', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
        ];
      case 'mobiles':
          return [
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '201', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '201', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '202', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '202', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
            {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
          ];
      case 'doorSensors':
        return [
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '111', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '102', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '203', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '205', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '202', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '303', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '401', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '502', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '603', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
        ];
      case 'all':
        return [
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '101', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '202', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '305', timestamp: 1557581738000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '401', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '502', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '601', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '602', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '603', timestamp: 1557581738000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '604', timestamp: 1557581238000, deviceType: 'thermostats',  connection: 'Offline'},
          {icon: 'speaker_group', deviceName: 'Thermostat', room: '605', timestamp: 1557581538000, deviceType: 'thermostats',  connection: 'Online'},
          {icon: 'tv', deviceName: 'TV - living room', room: '100', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '110', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room ', room: '204', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '206', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '301', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '304', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - living room', room: '401', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '400', timestamp: 1557589938000, connection: 'Online', deviceType: 'tvs'},
          {icon: 'tv', deviceName: 'TV - room', room: '203', timestamp: 1557589938000, connection: 'Offline', deviceType: 'tvs'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '101', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '204', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '203', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '201', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '200', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '301', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '302', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '601', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '602', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Offline'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - living room',    room: '701', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'calendar_view_day', deviceName: 'Curtain - room',    room: '702', timestamp: 1557585038000, deviceType: 'curtains', connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room ceiling',      room: '111', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - lighting washbasin',       room: '110', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - doctors light',    room: '201', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - bathroom light',  room: '304', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room',      room: '305', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room ceiling',      room: '411', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - lighting washbasin',       room: '410', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - doctors light',    room: '501', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - bathroom light',  room: '502', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Offline'},
          {icon: 'wb_incandescent',   deviceName: 'Lightings - living room',      room: '506', timestamp: 1557581738000, deviceType: 'lightings',  connection: 'Online'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '201', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '201', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '202', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '202', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Online'},
          {icon: 'phonelink_setup',   deviceName: 'Mobile', room: '205', timestamp: 1557581738000, deviceType: 'mobiles ',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '111', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '102', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '203', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '205', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '202', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '303', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '401', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '502', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Online'},
          {icon: 'lock_open',   deviceName: 'Door Sensor', room: '603', timestamp: 1557581738000, deviceType: 'doorSensors',  connection: 'Offline'},
        ];
      default:
        console.log('Não foram encontrados valores para type --> ', type);
    }
  }


  private getFakePropertyUnit(unitId,ownerId) {
    
      const dndStateSince = this.randomIntFromInterval(Date.now() - 6*60*60*1000,Date.now());

        return {
          ownername: ownerId,
        deviceId: unitId,
        unitName: unitId,

        timestamp:this.randomIntFromInterval(Date.now() - 6*60*60*1000,Date.now()),
        dndStateSince: dndStateSince,
        dndStateDuration: Date.now() - dndStateSince,
        relayLevel: Math.random() > 0.5 ? 'on' : 'off',
        dndState: this.getRandomDndState(),
        temperature: this.randomIntFromInterval(16,32),
        setpoint: this.randomIntFromInterval(16,32),
        lockState: Math.random() > 0.5 ? 'unlocked' : 'unlocked',
        packagesCount: this.randomIntFromInterval(0,10),
        visitorsCount: this.randomIntFromInterval(0,10),
        serviceRequestsCount: this.randomIntFromInterval(0,10),
        reservationsCount: this.randomIntFromInterval(0,10),
        presence:  Math.random() > 0.5 ? true : false,
        elapsedTime: 1570469033622,
        masterOff: Math.random() > 0.5 ? 'on' : 'off',
        pmsState: Math.random() > 0.5 ? 'unsold' : 'sold',
        doorSensorState:  Math.random() > 0.5 ? 'closed' : 'opened',

        tracker: "DeltixProcessing",
        deviceType: "PropertyUnit",
        traceType: 'property_unit'
      }
  }

  public generatePropertyUnitTraces(ownerId,unitIds) : Array<any>{
    let ret = [];
    
    unitIds.forEach(unitId => {
      ret.push(this.getFakePropertyUnit(ownerId + "." + unitId,ownerId));
    });


    return ret;

  }

  private getRandomDndState(){
    let random = Math.random();
    if(random < 0.25){
      return 'none'
    }
    if(random < 0.5){
      return 'make-up-room'
    }
    if(random < 0.75){
      return 'make-up-room'
    }
    return null;

  }

  randomIntFromInterval(min, max) {
    if(Math.random() < 0.2){
      return null;
    }


    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getPmsReport(startDate, endDate){
    let ret = [];
    let data = [
      {
        "date": 1549030611000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 10
        }
      },
      {
        "date": 1554131811000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 15
        }
      },
      {
        "date": 1567351011000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 15
        }
      },
      {
        "date": 1569943011000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 5
        }
      },
      {
        "date": 1572621411000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 7
        }
      },
      {
        "date": 1575209811000,
        "period": -1,
        "bucket": -1,
        "sampling": 10000,
        "total": 10000,
        "state": {
          "sold": 6
        }
      }
    ]
  
    
    data.forEach(element => {
      if(element['date'] >= startDate && element['date'] <= endDate){
        ret.push(element);
      }
    });

    return ret;
  }

  getAlertDataByProperty(propertyId) {

    let s1 = Math.random() > 0.5 ? 'critical' : 'warning';
    let s2 = Math.random() > 0.5 ? 'error' : 'critical';
    let s3 = Math.random() > 0.5 ? 'warning' : 'error';

    let alerts = [];

    let a1= 
      {
        deviceId:"capjuluca.Bacnet.villa1-manometer",
        severity: s1,
        startedAt: 1584370892000,
        text: "Pressure above x"
      }
      let a2=
      {
        deviceId:"capjuluca.Bacnet.villa1-hotwaterThermometer",
        severity: s2,
        startedAt: 1584284492000,
        text: "Temperature below x"
      }
      let a3=
      {
        deviceId:"capjuluca.Bacnet.villa1-2ndfloorThermometer",
        severity: s3,
        startedAt: 1581778892000,
        text: "Temperature above x"
      }

      alerts.push(a1);
      alerts.push(a2);
      alerts.push(a3);
      

      return alerts;
    
  }

  getfakeDataEvents(initialDate: Date): OrderEvent[] {
    const types: OrderEvent[] = [
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
        pt: "Cobertor",
        en: "Blanket"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c359b8713c090007e5380d",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Desentupidor",
          en: "Toilet unblocker"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35ba6713c090007e5380f",
        category: "Manutenção",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Lençol",
          en: "Sheet"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35bc7713c090007e53810",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Escova de cabelo",
          en: "Hairbrush"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35c08713c090007e53811",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Escova de dentes",
          en: "Toothbrush"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35c4a713c090007e53812",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Toalha de banho",
          en: "Bath towel"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35c65713c090007e53813",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Pijama",
          en: "Pajamas"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35c8c713c090007e53814",
        category: "Hotelaria",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Curativo",
          en: "Band Aid"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35ccc713c090007e53815",
        category: "Enfermagem",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Agua",
          en: "Water"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35d2e713c090007e53816",
        category: "Restaurante",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Suco",
          en: "Juice"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35d47713c090007e53817",
        category: "Restaurante",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      },
      {
        context: "unimedsorocaba",
        eventType: "OrderEvent",
        eventSubtype: "CreateOrder",
        source: "OrderEventKafkaProducer",
        subject: "302",
        producer: "Order-API",
        tags: [
          "noUnitMapping"
        ],
        labels: new Map(Object.entries({
          pt: "Limpeza",
          en: "Cleaning"
        })),
        location: ".Ala A.unimedsorocaba",
        item: "61c35db7713c090007e53818",
        category: "Manutenção",
        quantity: null,
        timestamp: 1638390078213,
        eventDate: new Date("2021-12-27T20:21:19.527+0000"),
        date: "2021-12-27T20:21:19.527+0000"
      }
    ];

    const diferentQuantity = types.length;

    let fakeDataArray = [];
    const dates: Date[] = [];

    // APLICANDO UM ESPAÇO DE UMA SEMANA PARA A GERAÇÃO DE FAKE DATA
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(initialDate.setDate(initialDate.getDate() + i)));
    }

    dates.forEach(dia => {
      // DEFINE A QUANTIDADE DE EVENTOS CRIADOS ENTRE 0 E 120
      const randomEventsOnThisDay = [];
      const random = Math.round((Math.random() * 120));
      for (let j = 0; j < random; j++) {
        //EXISTEM DEFINIDOS 11 EXEMPLOS DE EVENTOS RANDOMS, SERÁ SELECIONADO ALEATORIAMENTE
        const itemNumber = Math.round((Math.random()) * diferentQuantity) < diferentQuantity 
          ? Math.round((Math.random()) * diferentQuantity) 
          : Math.round((Math.random()) * diferentQuantity) - 1;
        const modified: OrderEvent = {
          ...types[itemNumber],
          eventDate: dia,
          date: dia.toUTCString(),
          //QUANTIADDE SERÁ ESCOLHIDA ALEATORIAMENTE ENTRE 1 E 5
          quantity: (Math.round((Math.random()) * 4) + 1).toString(),
        };
        randomEventsOnThisDay.push(modified);
      }
      fakeDataArray = fakeDataArray.concat(randomEventsOnThisDay);
    });

    return fakeDataArray;
  }

}
