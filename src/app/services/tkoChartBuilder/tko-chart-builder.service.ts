import { Injectable } from '@angular/core';
import { DateService } from '../date/date.service';
import { NumericRoundService, RoundValueInfo } from '../numericRound/numeric-round.service';
import { Consumption, Presence } from '@alis/proxper-base';
import { PeriodEnum } from '../data/data.service';
import { Historical } from '../../abstracts/historical';


@Injectable({
  providedIn: 'root'
})
export class TkoChartBuilderService {


    // prices for consumption
    effectivelySpentPrice = 0;
    savedPrice = 0;

    // keys
    savingKey;
    spentKey;
    occupancyKey;
    soldKey;



    constructor(private dateService: DateService, private numericRoundService: NumericRoundService){
    }


    buildConsumeData(comsumptions: Array<Consumption>, translations: Object, period: string, componentContext : Historical) {
        this.savingKey = translations['Savings'];
        this.spentKey = translations['HVAC Engaged'];

        let roundValueInfo: RoundValueInfo = {
            divideBy: 1,
            uom: "Wh"
          };


        // first lets build tempDataArray with all values 
        // to define roundValueInfo
        let tempData = [];
        comsumptions.forEach(consumption => {
          let whValue = consumption['kwh']*1000;
          let savingsValue = consumption['savingsKwh']*1000;
          tempData.push(whValue);
          tempData.push(savingsValue);
        });
        roundValueInfo = this.numericRoundService.getRoundValueInfoByArray(tempData,"Wh");

        // now, lets build consumption data based on
        // the roundValueInfo
        comsumptions.forEach(consumption => {
          let whValue = consumption['kwh']*1000;
          let savingsValue = consumption['savingsKwh']*1000;
          consumption['consume'] = this.numericRoundService.getRoundResult(roundValueInfo, whValue).value;
          consumption['savings'] = this.numericRoundService.getRoundResult(roundValueInfo, savingsValue).value;
        });
        
        let data;
        if (period == PeriodEnum.DAY_OF_WEEK) {
            // to build week/hours charts is a little bit different, so lets use a specific method
            data = this.buildConsumeDataWeek(comsumptions, translations, period, componentContext);
        } else {
            data = this.buildConsumeDataSummary(comsumptions, translations, period, componentContext);
        }

        if(data == null){
            data = [];
        }
        return {
            data: data,
            roundValueInfo: roundValueInfo
        }
    }

    private buildConsumeDataSummary(comsumptions: Array<Consumption>, translations: Object, period: string,componentContext : Historical) {
        const consumeArray = [];
        const savingsArray = [];
        let result: Consumption;
        let date: Date;
        let consume;
        let savings;
        this.effectivelySpentPrice = 0;
        this.savedPrice = 0;

        for (let i = 0; i < comsumptions.length; i++) {
            result = comsumptions[i];
            date = new Date(result.key);
            result['timestamp'] = result.key;
            consume = result['consume'];
            savings = result['savings'];

            let xAxis = componentContext.getXAxis(date);
            consumeArray.push({ x: xAxis, y: consume, consumptionInfo: result });
            savingsArray.push({ x: xAxis, y: savings, consumptionInfo: result });

        }
        return [
            {
                key: this.spentKey,
                values: consumeArray,
                color: '#ef5350'
            }, {
                key: this.savingKey,
                values: savingsArray,
                color: '#66bb6a'
            }
        ];
    }

    private buildConsumeDataWeek(results: Array<Consumption>, translations: Object, period: string, componentContext : Historical) {
        const consumeArray = [];
        const savingsArray = [];
        let date: Date;
        let consume;
        let savings;

        results = this.orderByWeekDay(results);

        results.forEach(result => {
            date = new Date(result.key);
            result['timestamp'] = result.key;
            consume = result['consume'];
            savings = result['savings'];
            let dayOfWeekTz = this.dateService.getDayOfWeek(date.getTime());
            let xAxis = componentContext.getXAxis(dayOfWeekTz);

            consumeArray.push({ x: xAxis, y: consume, consumptionInfo: result });
            savingsArray.push({ x: xAxis, y: savings, consumptionInfo: result });
        });
        return [
            {
                key: this.spentKey,
                values: consumeArray,
                color: '#ef5350'
            }, {
                key: this.savingKey,
                values: savingsArray,
                color: '#66bb6a'
            }
        ];
    }


    // CONSUME methods



    buildOccupancyData(results: Array<Presence>, translations: Object, resolution: string, period: string, componentContext : Historical) {
        this.occupancyKey = translations['Occupancy'];
        this.soldKey = translations['Sold'];

        if (period == PeriodEnum.DAY_OF_WEEK) {
            // to build week/hours charts is a little bit different, so lets use a specific method
            return this.buildOccupancyDataWeek(results, translations, resolution, period, componentContext);
        }
        else {
            return this.buildOccupancyDataSummary(results, translations, resolution, period, componentContext);
        }
    }

    private buildOccupancyDataWeek(results: Array<Presence>, translations: Object, resolution: string, period: string, componentContext : Historical) {
        let date: Date;
        let occupancy;
        let elapsedTime;
        let soldPercentage;
        let occupancyData = [];
        let soldData = [];

        results = this.orderByWeekDay(results);

        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            date = new Date(result.key);
            result['timestamp'] = result.key;
            occupancy = (result.presenceTime);
            elapsedTime = (result.elapsedTime);
            soldPercentage = (result.soldPercentage);
            let occupancyPercentage;
            
            if (elapsedTime != 0) {
                occupancyPercentage = occupancy / elapsedTime;
            } else {
                occupancyPercentage = 1;
            }

            let dayOfWeekTz = this.dateService.getDayOfWeek(date.getTime())
            let xAxis = componentContext.getXAxis(dayOfWeekTz);

            soldData.push({ x: xAxis, y: soldPercentage, presenceInfo: result });
            occupancyData.push({ x: xAxis, y: occupancyPercentage * 100, presenceInfo: result });

        }
        return [
            {
                key: this.occupancyKey,
                values: occupancyData,
                color: '#26c6da'
            }, {
                key: this.soldKey,
                values: soldData,
                color: '#ffa726'
            }
        ];
    }

    private buildOccupancyDataSummary(results: Array<Presence>, translations: Object, resolution: string, period: string, componentContext : Historical) {
        let occupancyData = [];
        const soldData = [];
        let result: Presence;
        let occupancy;
        let date;
        let elapsedTime;
        let soldPercentage;

        for (let i = 0; i < results.length; i++) {
            result = results[i];
            //occupancy in hours
            occupancy = (result.presenceTime);
            elapsedTime = (result.elapsedTime);
            soldPercentage = (result.soldPercentage);
            date = new Date(result.key);
            result['timestamp'] = result.key;
            let occupancyPercentage = occupancy / elapsedTime;

            if (elapsedTime != 0) {
                occupancyPercentage = occupancy / elapsedTime;
            } else {
                occupancyPercentage = 1;
            }

            soldData.push({ x: componentContext.getXAxis(date), y: soldPercentage, presenceInfo: result });
            occupancyData.push({ x: componentContext.getXAxis(date), y: occupancyPercentage * 100, presenceInfo: result });
        }

        return [
            {
                key: this.occupancyKey,
                values: occupancyData,
                color: '#26c6da'
            }, {
                key: this.soldKey,
                values: soldData,
                color: '#ffa726'
            }
        ];

    }

    orderByWeekDay(results) {
        results.sort((a,b) => {
            let dayOfWeek1 = new Date(a.key).getDay();
            let dayOfWeek2 = new Date(b.key).getDay();

            //if is sunday (dayOfWeek == 0), should be the last one
            if(dayOfWeek1 == 0) { return 1; }
            if(dayOfWeek2 == 0) { return -1; }

            return dayOfWeek1 < dayOfWeek2 ? -1 : dayOfWeek1 > dayOfWeek2 ? 1 : 0;
        });

        return results;
    }

}
