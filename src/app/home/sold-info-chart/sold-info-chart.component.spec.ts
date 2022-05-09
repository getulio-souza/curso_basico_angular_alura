import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldInfoChartComponent } from './sold-info-chart.component';

describe('SoldInfoChartComponent', () => {
  let component: SoldInfoChartComponent;
  let fixture: ComponentFixture<SoldInfoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldInfoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldInfoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
