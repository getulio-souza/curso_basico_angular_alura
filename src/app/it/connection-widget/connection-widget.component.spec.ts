import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionWidgetComponent } from './connection-widget.component';

describe('ConnectionWidgetComponent', () => {
  let component: ConnectionWidgetComponent;
  let fixture: ComponentFixture<ConnectionWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
