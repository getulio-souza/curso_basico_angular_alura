import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationPageComponent } from './optimizationPage.component';

describe('OptimizationPageComponent', () => {
  let component: OptimizationPageComponent;
  let fixture: ComponentFixture<OptimizationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
