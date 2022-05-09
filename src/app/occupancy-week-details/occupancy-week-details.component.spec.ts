import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyWeekDetailsComponent } from './occupancy-week-details.component';

describe('OccupancyWeekDetailsComponent', () => {
  let component: OccupancyWeekDetailsComponent;
  let fixture: ComponentFixture<OccupancyWeekDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupancyWeekDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupancyWeekDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
