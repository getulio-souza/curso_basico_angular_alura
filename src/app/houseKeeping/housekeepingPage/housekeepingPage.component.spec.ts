import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HousekeepingPageComponent } from './housekeepingPage.component';

describe('HousekeepingPageComponent', () => {
  let component: HousekeepingPageComponent;
  let fixture: ComponentFixture<HousekeepingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousekeepingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HousekeepingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
