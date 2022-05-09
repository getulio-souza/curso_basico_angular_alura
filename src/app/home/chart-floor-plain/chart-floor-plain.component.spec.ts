import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFloorPlainComponent } from './chart-floor-plain.component';

describe('ChartFloorPlainComponent', () => {
  let component: ChartFloorPlainComponent;
  let fixture: ComponentFixture<ChartFloorPlainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFloorPlainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFloorPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
