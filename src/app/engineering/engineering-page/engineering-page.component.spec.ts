import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringPageComponent } from './engineering-page.component';

describe('EngineeringPageComponent', () => {
  let component: EngineeringPageComponent;
  let fixture: ComponentFixture<EngineeringPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
