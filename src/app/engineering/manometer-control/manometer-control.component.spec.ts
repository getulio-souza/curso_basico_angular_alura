import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManometerControlComponent } from './manometer-control.component';

describe('ManometerControlComponent', () => {
  let component: ManometerControlComponent;
  let fixture: ComponentFixture<ManometerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManometerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManometerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
