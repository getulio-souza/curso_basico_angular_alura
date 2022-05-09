import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdChamberComponent } from './cold-chamber.component';

describe('ColdChamberComponent', () => {
  let component: ColdChamberComponent;
  let fixture: ComponentFixture<ColdChamberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdChamberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdChamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
