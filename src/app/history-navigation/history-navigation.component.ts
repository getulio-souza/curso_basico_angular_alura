import { DateService } from './../services/date/date.service';
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-history-navigation',
  templateUrl: './history-navigation.component.html',
  styleUrls: ['./history-navigation.component.css']
})
export class HistoryNavigationComponent implements OnInit {

  @Input() resolution;
  @Input() startDate;
  @Input() endDate;
  @Input() lastResolution;
  @Input() enableBackwardsNavigation = false;
  @Output() onViewChange = new EventEmitter<Object>();

  teste = "Sunday";
  //  monthNames
  monthNames = ['January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'];

  constructor(private dateService: DateService) { }

  ngOnInit() {
  }

  emitChanges() {
    this.onViewChange.emit({ startDate: this.startDate, endDate: this.endDate, resolution: this.resolution });
  }

  oneStepBack() {
    if (this.resolution === 'hour') {
      this.startDate = this.dateService.getBeginOfPassedMonth(this.startDate);
      this.endDate = this.dateService.getEndOfPassedMonth(this.endDate);
      this.resolution = 'day';
      this.emitChanges();
    } else if (this.resolution === 'day') {

      this.startDate = this.dateService.getBeginOfGivenYear(this.startDate);
      this.endDate = this.dateService.getEndOfGivenYear(this.endDate);
      this.resolution = 'month';
      this.emitChanges();
    }
  }

  oneStepFoward() {
    if (this.resolution === 'month') {
      this.startDate = this.dateService.getBeginOfPassedMonth(this.startDate);
      this.endDate = this.startDate;
      this.endDate = this.dateService.getEndOfPassedMonth(this.endDate);
      this.resolution = 'day';
      this.emitChanges();
    } else if (this.resolution === 'day') {
      this.startDate = this.dateService.getBeginOfPassedDay(this.startDate);
      this.endDate = this.startDate;
      this.endDate = this.dateService.getEndOfPassedDay(this.endDate);
      this.resolution = 'hour';
      this.emitChanges();
    }
  }

  getCurrentPeriodLabel() {
    //  returns the label time you are looking at
    //  e.g 2017 (year), Jan 2017 (month) or 1 Jan 2016 (day)
    // return "Sunday";
    const start: moment.Moment = moment(this.startDate);
    return { monthName: this.monthNames[start.get('month')], year: start.get('year'), day: start.date() };

  }



  getDateLabelDay(filter) {
    // filter 0 current time
    // filter -1 one step behind
    // filter 1 one step ahead
    let date: moment.Moment = moment(this.startDate);

    if (filter === 1) {
      date = date.add(1, 'days');
    } else if (filter === -1) {
      date = date.subtract(1, 'days');
    }

    return { monthName: this.monthNames[date.get('month')], year: date.get('year'), day: date.date() };
  }

  getDateLabelMonth(filter) {
    // filter 0 current time
    // filter -1 one step behind
    // filter 1 one step ahead
    let date: moment.Moment = moment(this.startDate);

    if (filter === 1) {
      date = date.add(1, 'months');
    } else if (filter === -1) {
      date = date.subtract(1, 'months');
    }

    return { monthName: this.monthNames[date.get('month')], year: date.get('year'), day: date.date() };
  }

  getDateLabelYear(filter) {
    // filter 0 current time
    // filter -1 one step behind
    // filter 1 one step ahead
    let date: moment.Moment = moment(this.startDate);

    if (filter === 1) {
      date = date.add(1, 'year');
    } else if (filter === -1) {
      date = date.subtract(1, 'year');
    }

    return date.get('year');
  }
  getNextPeriodLabel() {
    // /return the next period
    // based on the time selected
    const start = moment(this.startDate);
    let next: moment.Moment;
    if (this.resolution === 'month') {
      next = start.add(1, 'years');
      return next.get('year');
    } else if (this.resolution === 'day') {
      next = start.add(1, 'months');
      return this.monthNames[next.get('month')] + ' de ' + next.get('year');
    } else if (this.resolution === 'hour') {
      next = start.add(1, 'days');
      return next.date() + ' de ' + this.monthNames[next.get('month')];
    }

  }

  getPreviousPeriodLabel() {
    // /return the previous period
    // based on the time selected
    const start = moment(this.startDate);
    let previuos: moment.Moment;
    if (this.resolution === 'month') {
      previuos = start.subtract(1, 'years');
      return previuos.get('year');
    } else if (this.resolution === 'day') {
      previuos = start.subtract(1, 'months');
      return this.monthNames[previuos.get('month')] + ' de ' + previuos.get('year');
    } else if (this.resolution === 'hour') {
      previuos = start.subtract(1, 'days');
      return previuos.date() + ' de ' + this.monthNames[previuos.get('month')];
    }
  }

  goToNextPeriod() {
    // update dates to the next period

    let nextStart: moment.Moment;
    let nextEnd: moment.Moment;
    if (this.resolution === 'month') {
      //  year view

      nextStart = moment(this.dateService.getBeginOfGivenYear(this.startDate));
      nextEnd = moment(this.dateService.getEndOfGivenYear(this.startDate));

      nextStart = nextStart.add(1, 'years').startOf('year');
      nextEnd = nextEnd.add(1, 'years').endOf('year');
    } else if (this.resolution === 'day') {
      // month view

      nextStart = moment(this.dateService.getBeginOfPassedMonth(this.startDate));
      nextEnd = moment(this.dateService.getEndOfPassedMonth(this.startDate));

      nextStart = nextStart.add(1, 'months').startOf('month');
      nextEnd = nextEnd.add(1, 'months').endOf('month');
    } else if (this.resolution === 'hour') {
      // day view

      nextStart = moment(this.dateService.getBeginOfPassedDay(this.startDate));
      nextEnd = moment(this.dateService.getEndOfPassedDay(this.startDate));

      nextStart = nextStart.add(1, 'days').startOf('day');
      nextEnd = nextEnd.add(1, 'days').endOf('day');
    }
    this.startDate = nextStart.toDate().getTime();
    this.endDate = nextEnd.toDate().getTime();
    this.emitChanges();
  }

  goToPreviousPeriod() {
    // update dates to the next period

    let nextStart: moment.Moment;
    let nextEnd: moment.Moment;
    if (this.resolution === 'month') {
      //  year view

      nextStart = moment(this.dateService.getBeginOfGivenYear(this.startDate));
      nextEnd = moment(this.dateService.getEndOfGivenYear(this.startDate));

      nextStart = nextStart.subtract(1, 'years').startOf('year');
      nextEnd = nextEnd.subtract(1, 'years').endOf('year');
    } else if (this.resolution === 'day') {
      // month view

      nextStart = moment(this.dateService.getBeginOfPassedMonth(this.startDate));
      nextEnd = moment(this.dateService.getEndOfPassedMonth(this.startDate));

      nextStart = nextStart.subtract(1, 'months').startOf('month');
      nextEnd = nextEnd.subtract(1, 'months').endOf('month');
    } else if (this.resolution === 'hour') {
      // day view

      nextStart = moment(this.dateService.getBeginOfPassedDay(this.startDate));
      nextEnd = moment(this.dateService.getEndOfPassedDay(this.startDate));

      nextStart = nextStart.subtract(1, 'days').startOf('day');
      nextEnd = nextEnd.subtract(1, 'days').endOf('day');
    }
    this.startDate = nextStart.toDate().getTime();
    this.endDate = nextEnd.toDate().getTime();
    this.emitChanges();
  }


}
