import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphOccupancyWeekComponent } from './graph-occupancy-week.component';

describe('GraphOccupancyWeekComponent', () => {
  let component: GraphOccupancyWeekComponent;
  let fixture: ComponentFixture<GraphOccupancyWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphOccupancyWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphOccupancyWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
