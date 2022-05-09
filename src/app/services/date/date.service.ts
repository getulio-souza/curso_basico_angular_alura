import { Injectable } from '@angular/core';

import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';

import { PropertiesService } from '@alis/ng-services';

@Injectable()
export class DateService {

  private timezone;

  constructor(propertiesService: PropertiesService) {
    propertiesService.getAppConfig().subscribe(properties => {
      if (properties['timezone']) {
        this.timezone = properties['timezone'];
      } else {
        //could not find timezone in properties
        let guessTimezone = momentTimeZone.tz.guess();
        console.warn("Could not find property 'timezone' in config file. Using '" + guessTimezone + "' as default");
        this.timezone = guessTimezone;
      }
    })
  }

  getStartOfDayByStr(str: string) {
    let momentWithTz = momentTimeZone.tz(str, this.getTimezone());
    let timestamp = momentWithTz.toDate().getTime();
    return this.getBeginOfPassedDay(timestamp);
  }

  getEndOfDayByStr(str: string) {
    let momentWithTz = momentTimeZone.tz(str, this.getTimezone());
    let timestamp = momentWithTz.toDate().getTime();
    return this.getEndOfPassedDay(timestamp);
  }

  getTimezone() {
    if (!this.timezone) {
      //just to make sure
      return momentTimeZone.tz.guess();
    }

    return this.timezone;
  }

  private getMomentWithTimezone(timestamp) {
    let timezone = this.getTimezone();
    return momentTimeZone(timestamp).tz(timezone);
  }

  private getTimeInMs(date: moment.Moment) {
    return date.toDate().getTime();
  }


  getMonth(timestamp: number) {
    const momentTZone = this.getMomentWithTimezone(timestamp);
    return momentTZone.format('M');
  }

  getDayOfWeek(timestamp: number) {
    const momentTZone = this.getMomentWithTimezone(timestamp);
    return momentTZone.format('e');
  }


  getDay(timestamp: number) {
    const momentTZone = this.getMomentWithTimezone(timestamp);
    return momentTZone.format('D');
  }

  getHour(timestamp: number) {
    const momentTZone = this.getMomentWithTimezone(timestamp);
    return momentTZone.format('H');
  }

  getHoursBefore(hours) {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(hours, 'hours'));
  }

  getCurrentTime() {
    return new Date().getTime();
  }

  getMinutesBefore(minutes): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(minutes, 'minutes'));
  }
  getOneHourBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'hours'));
  }

  getOneDayBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'days'));
  }

  getOneDayAfter(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.add(1, 'days'));
  }


  addOneDay(timestamp): number {
    const momentTZone = this.getMomentWithTimezone(timestamp);
    return this.getTimeInMs(momentTZone.add(1, 'days'));
  }

  getOneWeekBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'weeks'));
  }

  getOneMonthBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'months'));
  }

  getXMonthsBefore(months: number): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(months, 'months'));
  }

  getXDaysBeforeFromNow(days: number): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(days, 'days'));
  }

  getXDaysBefore(timestamp: number, days: number): number {
    const current = moment(timestamp);
    return this.getTimeInMs(current.subtract(days, 'days'));
  }

  getOneYearBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'years'));
  }

  getBeginCurrentWeek(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.startOf('week'));
  }

  getEndCurrentWeek(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.endOf('week'));
  }

  getBeginCurrentMonth(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.startOf('month'));
  }

  getEndCurrentMonth(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.endOf('month'));
  }

  getBeginCurrentYear(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.startOf('year'));
  }

  getEndCurrentYear(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.endOf('year'));
  }

  getEndmomentTZoneMonth(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.endOf('month'));
  }

  getBeginLastMonth(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'months').startOf('month'));
  }

  getEndLastMonth(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(1, 'months').endOf('month'));
  }

  get12WeeksBefore(): number {
    const momentTZone = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(momentTZone.subtract(12, 'weeks'));
  }

  getBeginOfPassedDay(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.startOf('day'));

  }

  getEndOfPassedDay(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.endOf('day'));

  }

  getBeginOfPassedMonth(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.startOf('month'));

  }

  getEndOfPassedMonth(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.endOf('month'));

  }

  getBeginOfGivenYear(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.startOf('year'));

  }

  getBeginPassedMinute(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.startOf('minute'));
  }

  getBeginAndEndOfPeriod(timestamp: number, resolution: 'hour' | 'day' | 'month'): { begin: number, end: number } {
    if (resolution == 'hour') {
      return {
        begin: this.getBeginOfPassedDay(timestamp),
        end: this.getEndOfPassedDay(timestamp),
      }
    } else if (resolution == 'day') {
      return {
        begin: this.getBeginOfPassedMonth(timestamp),
        end: this.getEndOfPassedMonth(timestamp),
      }
    } else if (resolution == 'month') {
      return {
        begin: this.getBeginOfGivenYear(timestamp),
        end: this.getEndOfGivenYear(timestamp),
      }
    }
  }

  getStartCurrentDay(): number {
    const timeMoment = moment(new Date());
    return this.getTimeInMs(timeMoment.startOf('day'));
  }

  getStartOfDay(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);
    return this.getTimeInMs(timeMoment.startOf('day'));
  }

  getEndOfDay(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);
    return this.getTimeInMs(timeMoment.endOf('day'));
  }

  getStartCurrentHour(): number {
    const timeMoment = moment(new Date());
    return this.getTimeInMs(timeMoment.startOf('hour'));
  }



  getEndOfGivenYear(timestamp: number): number {
    const timeMoment = this.getMomentWithTimezone(timestamp);;
    return this.getTimeInMs(timeMoment.endOf('year'));

  }

  getWeeksBefore(numberOfWeeks: number) {
    const current = this.getMomentWithTimezone(new Date().getTime());
    return this.getTimeInMs(current.subtract(numberOfWeeks, 'weeks'));
  }


  getTimeZoneName() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

}
