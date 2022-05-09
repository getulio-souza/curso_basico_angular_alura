import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CallUsagePercentChartComponent } from './call-usage-percent-chart';


describe('CallUsagePercentChartComponent', () => {
  let component: CallUsagePercentChartComponent;
  let fixture: ComponentFixture<CallUsagePercentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallUsagePercentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallUsagePercentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
