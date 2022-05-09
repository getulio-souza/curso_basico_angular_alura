import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintViewUnitComponent } from './blueprint-view-unit.component';

describe('BlueprintViewUnitComponent', () => {
  let component: BlueprintViewUnitComponent;
  let fixture: ComponentFixture<BlueprintViewUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintViewUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintViewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
