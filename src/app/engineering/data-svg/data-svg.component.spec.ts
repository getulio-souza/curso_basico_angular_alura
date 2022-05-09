import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSvgComponent } from './data-svg.component';

describe('DataSvgComponent', () => {
  let component: DataSvgComponent;
  let fixture: ComponentFixture<DataSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
