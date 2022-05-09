import { map } from 'rxjs/operators';
import { TraceType } from './../../../../services/data/data.service';
import { Injectable } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { DataService } from '../../../../services/data/data.service';


@Injectable({
  providedIn: 'root',
})
export class IndicatorService {

  constructor(private dataService: DataService) {

  }


  getSoldIndicator(propertyId) {

    return this.getPropertyData(propertyId).pipe(map((res) => {
      const propertyUnit = res[1];

      let label = null;
      let value = null;

      const pmsState = propertyUnit.pmsState;
      const total = propertyUnit.total;
      const date = propertyUnit.date;

      if (pmsState != null) {

        const totalSold = pmsState['sold'] != null ? pmsState['sold'] : 0;
        const totalUnsold = pmsState['unsold'] != null ? pmsState['unsold'] : 0;

        const soldNaPercentage = 100 * (total - totalSold - totalUnsold) / total;
        const soldPercentage = 100 * (totalSold / total);
        const unSoldPercentage = 100 * (totalUnsold / total);

        label = Math.round(soldPercentage * 10) / 10 + " %";

        //calculating - total 5
        value = soldPercentage / 20;
        value = Math.round(value * 10) / 10;
      }

      return {
        label: label,
        value: value,
        date: date
      }
      
    }));
    
  }
  
  getPresenceIndicator(propertyId) {
    return this.getPropertyData(propertyId).pipe(map((res) => {
      const propertyUnit = res[1];

      let label = null;
      let value = null;
      
      const presence = propertyUnit.presence;
      const total = propertyUnit.total;
      const date = propertyUnit.date;

      if (presence != null) {
        
        const totalOccupied = presence['true'] != null ? presence['true'] : 0;
        const totalUnccupied = presence['false'] != null ? presence['false'] : 0;
        
        const occupiedPercentage = 100 * (totalOccupied / total);
        const occupancyNaPercentage = 100 * (total - totalOccupied - totalUnccupied) / total;
        const unOccupiedPercentage = 100 * (totalUnccupied / total);
        
        label = Math.round(occupiedPercentage * 10) / 10 + " %";
      

        //calculating - total 5
        value = occupiedPercentage / 20;
        value = Math.round(value * 10) / 10;
      }

      return {
        label: label,
        value: value,
        date: date
      }

    }));

  }

  getSavingsIndicator() {
    return of({
      label: '22 kwh',
      value: 1.5
    });
  }

  getWaterLevelIndicator() {
    return of({
      label: 111,
      value: 3.5
    });
  }

  getAlertIndicator() {
    return of({
      label: 32,
      value: 3.4
    });
  }


  getStaffPresence() {
    return of({
      label: 10,
      value: 2.5
    });
  }

  getPropertyData(propertyId) {

    let body = {};
    body['kwh'] = 'SUM';
    const emsAggregation = this.dataService.latestTraceByTypeOwnerAndTag(TraceType.EMS, propertyId, propertyId, body, null).pipe(map(res => res));

    body['presence'] = 'ENUM';
    body['pmsState'] = 'ENUM';
    const propertyUnit = this.dataService.latestTraceByTypeOwnerAndTag(TraceType.UNIT, propertyId, propertyId, body, null).pipe(map(res => res))

    return forkJoin([emsAggregation, propertyUnit]).pipe(map(results => {
      return results;
    }));

  }

}