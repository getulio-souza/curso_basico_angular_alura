import { AfterViewInit } from "@angular/core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CalendarHelper } from "../services/calendarHelper";
import { DateService } from "../services/date/date.service";

@Component({
  selector: "app-history-navigation-inputed",
  templateUrl: "./history-navigation-inputed.component.html",
  styleUrls: ["./history-navigation-inputed.component.scss"],
})
export class HistoryNavigationInputedComponent
  implements OnInit, AfterViewInit
{
  @Input() startDate: number;
  @Input() endDate: number;
  @Output() onViewChange = new EventEmitter<Object>();
  @Input() showFilter: boolean = true;

  @Input() resolution: "hour" | "day" | "year";

  rangeDates: Date[];
  showTime = false;

  periods = [
    { label: "últimas 24h", value: "últimas 24h" },
    { label: "últimas 48h", value: "últimas 48h" },
    { label: "última semana", value: "última semana" },
    { label: "último mês", value: "último mês" },
  ];
  period: "últimas 24h" | "últimas 48h" | "última semana" | "último mês";

  lang: string;

  constructor(
    private dateService: DateService,
    private translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.pickPeriod("últimas 24h");
  }

  ngOnInit() {
    this.rangeDates = [new Date(this.startDate), new Date(this.endDate)];
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(() => {
      this.lang = this.translateService.currentLang;
    });
  }

  getCalendarLang() {
    if (this.lang == "pt") {
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
    this.onViewChange.emit({
      startDate: this.startDate,
      endDate: this.endDate,
      resolution: this.resolution,
    });
    this.rangeDates = dates;
    this.period = null;
  }

  pickPeriod(
    period: "últimas 24h" | "últimas 48h" | "última semana" | "último mês"
  ) {
    this.period = period;

    if (period === "últimas 24h") {
      this.startDate = this.dateService.getOneDayBefore();
      this.endDate = new Date().getTime();
    } else if (period == "últimas 48h") {
      this.startDate = this.dateService.getXDaysBeforeFromNow(2);
      this.endDate = new Date().getTime();
    } else if (period === "última semana") {
      this.startDate = this.dateService.getXDaysBeforeFromNow(7);
      this.endDate = new Date().getTime();
    } else if (period === "último mês") {
      this.startDate = this.dateService.getOneMonthBefore();
      this.endDate = new Date().getTime();
    }

    this.rangeDates = [new Date(this.startDate), new Date(this.endDate)];
    this.onViewChange.emit({
      startDate: this.startDate,
      endDate: this.endDate,
      resolution: this.resolution,
    });
  }

  filterByDate(): void {
    this.onViewChange.emit({
      startDate: this.rangeDates[0],
      endDate: this.rangeDates[1],
      resolution: this.resolution,
    });
  }
}
