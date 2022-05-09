import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdChamberEvolutixComponent } from './cold-chamber-evolutix.component';

describe('ColdChamberEvolutixComponent', () => {
  let component: ColdChamberEvolutixComponent;
  let fixture: ComponentFixture<ColdChamberEvolutixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdChamberEvolutixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdChamberEvolutixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
