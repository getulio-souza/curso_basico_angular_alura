import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPieChartComponent } from './rating-pie-chart.component';

describe('RatingPieChartComponent', () => {
  let component: RatingPieChartComponent;
  let fixture: ComponentFixture<RatingPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
