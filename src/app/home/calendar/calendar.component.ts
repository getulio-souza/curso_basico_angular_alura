import { PropertiesService } from '@alis/ng-services';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit, Input, NgZone } from '@angular/core';

@Component({
  selector: 'home-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  @Input() properties;

  cityLabel;
  dataLabel;

  constructor(private zone: NgZone,
    private translate: TranslateService,
    private propertiesService: PropertiesService) {
  }

  ngOnInit() {
    this.start();
  }

  start() {
    this.zone.runOutsideAngular(() => {
      this.getCityLabel();
      this.tickClock();
    })
  }


  getCityLabel() {

    if(this.properties != null){
      let cityLabel = this.properties['hospitalityWeatherCityLabel']
      if (cityLabel) {
        this.cityLabel = cityLabel;
      } else {
        console.error("Could not find property hospitalityWeatherCityLabel in properties file");
      }
    } else {
      console.error("Could not find properties file");
    }
  }

  tickClock() {
    this.dataLabel = this.getDateLabel();
    let now = new Date();
    let timeout = 60000 - ((now.getSeconds() * 1000) + now.getMilliseconds());
    if (timeout < 0) {
      timeout = 0;
    }
    setTimeout(() => {
      this.tickClock();
    }, timeout);
  }

  getDateLabel() {
    let date = new Date();
    let monthName;
    this.translate.get("label-month-" + (date.getMonth() + 1)).subscribe(
      (translateMonthName) => {
        monthName = translateMonthName;
        this.translate.get(
          "label-date-simple", {
            month: monthName,
            day: date.getDate()
          }).subscribe((translation) => {
            this.zone.run(() => {
              this.dataLabel = translation;
            })
          }
          );
      }
    );
    return this.dataLabel
  }
}
