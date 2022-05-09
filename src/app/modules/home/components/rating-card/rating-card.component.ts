
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IndicatorService } from './../../services/indicator/indicator.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Component, Input } from '@angular/core';
import { RealTime } from '../../../../abstracts/realTime';


@Component({
  selector: "home-rating-card",
  templateUrl: "./rating-card.component.html",
  styleUrls: ["./rating-card.component.scss"]
})
export class RatingCardComponent implements OnInit, OnDestroy {


  @Input() indicatorGroup;
  @Input() propertyId;

  realTimeMap = {};
  realTime: RealTime;

  total = null;
  count = 0;
  average = null;


  constructor(private indicatorService: IndicatorService) {
  }

  ngOnInit() {

    if (this.indicatorGroup != null) {
      if (this.indicatorGroup.indicators != null) {

        //getting data for each indicator
        this.indicatorGroup.indicators.forEach(indicator => {
          const id = indicator.id;

          // first checks if realTime already exists for this indicator
          let currentRealTime = this.realTimeMap[id];

          if (currentRealTime == null) {
            // first time, lets create real time
            currentRealTime = new RealTime();

            //and add it to the realTimeMap
            this.realTimeMap[id] = currentRealTime;


            currentRealTime.startGettingRealTimeData(() => {
              
              // getting indicators data
              this.getIndicatorData(id).subscribe((res) => {
                indicator.data = res;
                const newDate = indicator.data.date;

                // updating indicatorGroup date
                // with the latest indicator's date
                let lastDate = this.indicatorGroup.date;
                if (lastDate == null || newDate > lastDate) {
                  lastDate = newDate;
                }
                this.indicatorGroup.date = lastDate;
              });
            });
          }

        });
      }
    }
  }

  ngOnDestroy(): void {
    
    for (var indicatorId of Object.keys(this.realTimeMap)) {
      const realTime = this.realTimeMap[indicatorId];
      realTime.ngOnDestroy();
  }
    
  }




  getIndicatorData(indicatorId) {

    switch (indicatorId) {
      case 'sold':
        return this.calculateIndicator(this.indicatorService.getSoldIndicator(this.propertyId));
      case 'presence':
        return this.calculateIndicator(this.indicatorService.getPresenceIndicator(this.propertyId));
      case 'savings':
        return this.calculateIndicator(this.indicatorService.getSavingsIndicator());
      case 'staffPresence':
        return this.calculateIndicator(this.indicatorService.getStaffPresence());
      case 'alerts':
        return this.calculateIndicator(this.indicatorService.getAlertIndicator());
      case 'waterLevel':
        return this.calculateIndicator(this.indicatorService.getWaterLevelIndicator());
      default:
        console.warn("Received unknown indicatorId '" + indicatorId + "'");
        return of({
          label: '--',
          value: "--"
        });
    }
  }



  calculateIndicator(indicatorServiceFunc: Observable<any>) {

    return indicatorServiceFunc.pipe(map(((res) => {
      if (this.total == null) {
        this.total = 0;
      }
      const value = res.value;

      if (value != null) {

        this.total += value;
        this.count++;

        let avg = this.total / this.count;

        this.average = Math.round(avg * 10) / 10;

      }
      return res;
    })));

  }

}
