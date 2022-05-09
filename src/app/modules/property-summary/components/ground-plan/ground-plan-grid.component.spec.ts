import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundPlanGridComponent } from './ground-plan-grid.component';

describe('GroundPlanGridComponent', () => {
  let component: GroundPlanGridComponent;
  let fixture: ComponentFixture<GroundPlanGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroundPlanGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundPlanGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
