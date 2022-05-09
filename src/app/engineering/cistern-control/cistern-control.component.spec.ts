import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CisternControlComponent } from './cistern-control.component';

describe('CisternControlComponent', () => {
  let component: CisternControlComponent;
  let fixture: ComponentFixture<CisternControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CisternControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CisternControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
