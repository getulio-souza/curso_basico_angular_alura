import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeInfoChartComponent } from './consume-info-chart.component';

describe('ConsumeInfoChartComponent', () => {
  let component: ConsumeInfoChartComponent;
  let fixture: ComponentFixture<ConsumeInfoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumeInfoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumeInfoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
