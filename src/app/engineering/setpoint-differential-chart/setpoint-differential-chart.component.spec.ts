import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetpointDifferentialChartComponent } from './setpoint-differential-chart.component';

describe('SetpointDifferentialChartComponent', () => {
  let component: SetpointDifferentialChartComponent;
  let fixture: ComponentFixture<SetpointDifferentialChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetpointDifferentialChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetpointDifferentialChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
