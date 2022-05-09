import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedColdChamberComponent } from './advanced-cold-chamber.component';

describe('AdvancedColdChamberComponent', () => {
  let component: AdvancedColdChamberComponent;
  let fixture: ComponentFixture<AdvancedColdChamberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedColdChamberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedColdChamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
