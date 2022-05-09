import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQtyChartComponent } from './order-qty-chart.component';

describe('OrderQtyChartComponent', () => {
  let component: OrderQtyChartComponent;
  let fixture: ComponentFixture<OrderQtyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderQtyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderQtyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
