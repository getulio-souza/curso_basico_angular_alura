import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermometersComponent } from './thermometers.component';

describe('ThermometersComponent', () => {
  let component: ThermometersComponent;
  let fixture: ComponentFixture<ThermometersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermometersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermometersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
