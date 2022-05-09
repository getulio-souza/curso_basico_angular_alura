import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorPlanSvgComponent } from './floor-plan-svg.component';

describe('FloorPlanSvgComponent', () => {
  let component: FloorPlanSvgComponent;
  let fixture: ComponentFixture<FloorPlanSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorPlanSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPlanSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
