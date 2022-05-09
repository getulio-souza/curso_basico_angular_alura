import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderBySectorsChartComponent } from './order-by-sectors-chart.component';


describe('OrderBySectorsChartComponent', () => {
  let component: OrderBySectorsChartComponent;
  let fixture: ComponentFixture<OrderBySectorsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBySectorsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBySectorsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
