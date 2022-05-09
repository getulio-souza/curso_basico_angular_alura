
import { map } from 'rxjs/operators';
import { DateService } from './../services/date/date.service';
import { Component, Input, OnChanges } from '@angular/core';
import { DataService, TraceType } from '../services/data/data.service';
import { AbstractThirtyDays } from '../abstracts/abstractThirtyDays';
@Component({
  selector: 'app-card-info-summary',
  templateUrl: './card-info-summary.component.html',
  styleUrls: ['./card-info-summary.component.css']
})
export class CardInfoSummaryComponent extends AbstractThirtyDays implements OnChanges {

  @Input() energyGroupId: string;

  startCurrentDay;

  // chart configs
  options;
  data;
  dataPrev;


  //energy
  totalRunTimeLast30Days = 0;
  totalSavingRunTimeLast30Days = 0;
  totalRunTimePrevData = 0;
  totalSavingRunTimePrevData = 0;

  //presence
  presenceLast30Days;
  presencePrevData;
  soldLast30Days;
  soldPrevData;

  readonly variationColorClassPositive: string = 'text-success';
  readonly variationColorClassNegative: string = 'text-danger';
  readonly variationColorClassNone: string = 'text-none';
  readonly negativeAttributes: Set<string> = new Set(['energy']);

  constructor(private dataService: DataService,dateService: DateService) {
    super(dateService);
    this.data = {};
    this.dataPrev = {};
  }

  ngOnChanges() {
    this.getData();
  }

  getData() {
    // lets save last 30 days info in data
    // and -30-60 days info in dataPrev


    //last 30 days
    this.getLast30Days().subscribe((res) => {
      this.data = res;
    });


    // prev data
    this.getPrevData().subscribe((res) => {
      this.dataPrev = res;
    });
  }

  getVariation(attribute: string): number {
    if (!this.data || !this.dataPrev) { return 0; }

    const value = this.data[attribute];
    const valuePrev = this.dataPrev[attribute];
    let ret = Math.round(100.0 * (value - valuePrev) / valuePrev);

    if (ret) {
      //to prevent showing NaN as variation value
      return ret;
    }
    return 0;
  }

  getVariationAbs(attribute: string): number {
    return Math.abs(this.getVariation(attribute));
  }

  getVariationColorClass(attribute: string): string {
    const variation = this.getVariation(attribute);
    if (!variation || variation === Infinity || variation === NaN) {
      return this.variationColorClassNone;
    }

    let result = this.variationColorClassPositive;
    let isNegative = (variation < 0);
    if (this.negativeAttributes.has(attribute)) {
      // inverts whether outlook is negative or not
      isNegative = !isNegative;
    }
    if (isNegative) {
      result = this.variationColorClassNegative;
    }
    return result;
  }

  getVariationIconClass(attribute: string): string {
    const variation = this.getVariation(attribute);
    return (variation < 0) ? 'arrow_downward' : 'arrow_upward';
  }


  getLast30Days() {
    this.startCurrentDay = this.getStartCurrentDay();
    let oneMonthBefore = this.dateService.getXDaysBefore(this.startCurrentDay,30);
    return this.getMonthData(oneMonthBefore, this.startCurrentDay, true);
  }


  getPrevData() {
    this.startCurrentDay = this.getStartCurrentDay();
    let oneMonthBefore = this.dateService.getXDaysBefore(this.startCurrentDay, 30);
    let twoMonthsBefore = this.dateService.getXDaysBefore(this.startCurrentDay, 60);
    return this.getMonthData(twoMonthsBefore, oneMonthBefore, false);
  }

  getStartCurrentDay() {
    if (!this.startCurrentDay) {
      this.startCurrentDay = this.dateService.getStartCurrentDay();
    }
    return this.startCurrentDay;
  }

  getMonthData(startMonthDate, endMonthDate, isLast30Days) {
    var that = this;
    //first lets get consumption date
    return this.dataService.getEmsAggregation(TraceType.PROPERTY , this.energyGroupId, this.energyGroupId, startMonthDate, endMonthDate, false).pipe(
      map(
        (result) => {

          let presence = 0;
          let energy = 0;
          let savings = 0;
          let sold = 0;

          if (result) {
            let data = result
            this.buildSummary(data, isLast30Days);
            presence = isLast30Days ? this.presenceLast30Days : this.presencePrevData;
            energy = isLast30Days ? this.totalRunTimeLast30Days : this.totalRunTimePrevData;
            savings = isLast30Days ? this.totalSavingRunTimeLast30Days : this.totalSavingRunTimePrevData;
            sold = isLast30Days ? this.soldLast30Days : this.soldPrevData;
          }

          return {
            energy: energy,
            savings: savings,
            presence: presence,
            sold: sold
          };

        }));
  }


  buildSummary(result, isLast30Days) {


    // FIXME as we know data is being sent every hour
    // we are using 1h*thermostats count
    const totalElapsedTime = 60*60*1000 * result['thermostat-count'];

    if (isLast30Days) {
      // this month
      this.presenceLast30Days = 100 * (result['presence-time'] / totalElapsedTime );
      this.totalRunTimeLast30Days = 100 * (result.runtime / totalElapsedTime);
      this.totalSavingRunTimeLast30Days = 100 * (result.savings / (result.savings + result.runtime));
      this.soldLast30Days = this.dataService.calculateSoldPercentage(result);
    } else {
      //last month
      this.presencePrevData = 100 * (result.presenceTime / totalElapsedTime);
      this.totalRunTimePrevData = 100 * (result.runtime / totalElapsedTime);
      this.totalSavingRunTimePrevData = 100 * (result.savings / (result.savings + result.runtime));
      this.soldPrevData = this.dataService.calculateSoldPercentage(result);
    }

  }


}
