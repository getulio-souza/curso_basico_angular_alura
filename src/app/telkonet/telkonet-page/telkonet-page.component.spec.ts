import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelkonetPageComponent } from './telkonet-page.component';

describe('TelkonetPageComponent', () => {
  let component: TelkonetPageComponent;
  let fixture: ComponentFixture<TelkonetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelkonetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelkonetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
