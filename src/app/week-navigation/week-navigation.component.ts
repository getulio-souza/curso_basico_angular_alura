import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-week-navigation',
  templateUrl: './week-navigation.component.html',
  styleUrls: ['./week-navigation.component.css']
})
export class WeekNavigationComponent implements OnInit {

  @Input() resolution;
  @Input() dayName;
  @Output() onStepBack = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() {
  }

  oneStepBack() {
    this.emitOneStepBack();
  }

  emitOneStepBack() {
    this.onStepBack.emit();
  }

  getWeekDayName() {
    return this.dayName;
  }
}
