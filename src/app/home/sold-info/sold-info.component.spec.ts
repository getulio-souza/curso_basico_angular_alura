import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldInfoComponent } from './sold-info.component';

describe('SoldInfoComponent', () => {
  let component: SoldInfoComponent;
  let fixture: ComponentFixture<SoldInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
