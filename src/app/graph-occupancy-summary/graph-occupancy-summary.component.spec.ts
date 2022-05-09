import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphOccupancySummaryComponent } from './graph-occupancy-summary.component';

describe('GraphOccupancySummaryComponent', () => {
  let component: GraphOccupancySummaryComponent;
  let fixture: ComponentFixture<GraphOccupancySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphOccupancySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphOccupancySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
