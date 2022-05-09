import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterOffControlComponent } from './master-off-control.component';

describe('MasterOffControlComponent', () => {
  let component: MasterOffControlComponent;
  let fixture: ComponentFixture<MasterOffControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterOffControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterOffControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
