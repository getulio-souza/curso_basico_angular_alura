import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConsumptionChartsComponent } from './active-consumption-charts.component';

describe('ActiveConsumptionChartsComponent', () => {
  let component: ActiveConsumptionChartsComponent;
  let fixture: ComponentFixture<ActiveConsumptionChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveConsumptionChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveConsumptionChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
