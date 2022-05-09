import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsInfoComponent } from './floors-info.component';

describe('FloorsInfoComponent', () => {
  let component: FloorsInfoComponent;
  let fixture: ComponentFixture<FloorsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
