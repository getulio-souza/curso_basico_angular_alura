import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top4MostDemandByCategoryChart } from './top4-most-demand-by-category-chart.component';

describe('Top4MostDemandByCategoryChart', () => {
  let component: Top4MostDemandByCategoryChart;
  let fixture: ComponentFixture<Top4MostDemandByCategoryChart>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top4MostDemandByCategoryChart ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top4MostDemandByCategoryChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
