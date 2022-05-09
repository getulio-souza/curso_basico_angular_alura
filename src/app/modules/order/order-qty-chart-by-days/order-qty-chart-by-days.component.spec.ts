import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQtyChartByDaysComponent } from './order-qty-chart-by-days.component';

describe('OrderQtyChartByDaysComponent', () => {
  let component: OrderQtyChartByDaysComponent;
  let fixture: ComponentFixture<OrderQtyChartByDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderQtyChartByDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderQtyChartByDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
