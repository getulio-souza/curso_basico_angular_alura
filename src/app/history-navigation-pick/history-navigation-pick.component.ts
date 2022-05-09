import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalendarHelper } from '../services/calendarHelper';
import { DateService } from '../services/date/date.service';

@Component({
  selector: 'app-history-navigation-pick',
  templateUrl: './history-navigation-pick.component.html',
  styleUrls: ['./history-navigation-pick.component.scss']
})
export class HistoryNavigationPickComponent implements OnInit {

  @Input() startDate: number;
  @Input() endDate: number;
  @Output() onViewChange = new EventEmitter<Object>();

  @Input() resolution: 'hour' | 'day' | 'year';

  rangeDates: Date[];
  showTime = false;

  periods = ['This week', 'This month', 'This year'];
  period: 'This week' | 'This month' | 'This year';

  lang: string;

  constructor(private dateService: DateService, private translateService: TranslateService) { }

  ngOnInit() {
    this.rangeDates = [new Date(this.startDate), new Date(this.endDate)];
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(() => {
      this.lang = this.translateService.currentLang;
    });
  }

  getCalendarLang() {
    if (this.lang == 'pt') {
      return CalendarHelper.pt;
    }
    return CalendarHelper.en;
  }

  setRangeDate(dates: Date[]) {
    if (dates[0] != null && dates[1] != null) {
      this.endDate = dates[1].getTime();
    } else if (dates[1] == null) {
      this.endDate = dates[0].getTime();
    }
    this.startDate = dates[0].getTime();
    this.onViewChange.emit({ startDate: this.startDate, endDate: this.endDate, resolution: this.resolution });
    this.rangeDates = dates;
    this.period = null;
  }

  pickPeriod(period: 'This week' | 'This month' | 'This year') {
    this.period = period;
    if (period == 'This week') {
      this.startDate = this.dateService.getBeginCurrentWeek();
      this.endDate = this.dateService.getEndCurrentWeek();
    } else if (period == 'This month') {
      this.startDate = this.dateService.getBeginCurrentMonth();
      this.endDate = this.dateService.getEndCurrentMonth();
    } else if (period == "This year") {
      this.startDate = this.dateService.getBeginCurrentYear();
      this.endDate = this.dateService.getEndCurrentYear();
    }
    this.rangeDates = [new Date(this.startDate), new Date(this.endDate)];
    this.onViewChange.emit({ startDate: this.startDate, endDate: this.endDate, resolution: this.resolution });
  }

}
