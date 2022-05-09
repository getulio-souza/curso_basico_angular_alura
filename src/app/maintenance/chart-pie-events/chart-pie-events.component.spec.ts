import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPieEventsComponent } from './chart-pie-events.component';

describe('ChartPieEventsComponent', () => {
  let component: ChartPieEventsComponent;
  let fixture: ComponentFixture<ChartPieEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPieEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPieEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
