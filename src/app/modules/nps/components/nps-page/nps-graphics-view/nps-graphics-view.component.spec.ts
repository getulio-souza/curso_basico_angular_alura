/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NpsGraphicsViewComponent } from './nps-graphics-view.component';

describe('NpsGraphicsViewComponent', () => {
  let component: NpsGraphicsViewComponent;
  let fixture: ComponentFixture<NpsGraphicsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsGraphicsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsGraphicsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
