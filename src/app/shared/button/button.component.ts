import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() color: string;
  @Input() full: string;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit() {}
}
