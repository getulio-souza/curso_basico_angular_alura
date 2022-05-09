import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeuproomDeltaTimeChartComponent } from './makeuproom-delta-time-chart.component';

describe('MakeuproomDeltaTimeChartComponent', () => {
  let component: MakeuproomDeltaTimeChartComponent;
  let fixture: ComponentFixture<MakeuproomDeltaTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeuproomDeltaTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeuproomDeltaTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
