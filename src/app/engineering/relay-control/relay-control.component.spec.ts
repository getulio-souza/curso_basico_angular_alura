import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelayControlComponent } from './relay-control.component';

describe('RelayControlComponent', () => {
  let component: RelayControlComponent;
  let fixture: ComponentFixture<RelayControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelayControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelayControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
