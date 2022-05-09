import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChartAdvancedColdChamberComponent } from './multi-chart-advanced-cold-chamber.component';

describe('MultiChartAdvancedColdChamberComponent', () => {
  let component: MultiChartAdvancedColdChamberComponent;
  let fixture: ComponentFixture<MultiChartAdvancedColdChamberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiChartAdvancedColdChamberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChartAdvancedColdChamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
