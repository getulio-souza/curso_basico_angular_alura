import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphOccupancyRealTimeComponent } from './graph-occupancy-real-time.component';

describe('GraphOccupancyRealTimeComponent', () => {
  let component: GraphOccupancyRealTimeComponent;
  let fixture: ComponentFixture<GraphOccupancyRealTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphOccupancyRealTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphOccupancyRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
