import { Component, OnInit } from '@angular/core';
import { AbstractSvgDrawComponent } from '../../abstracts/abstractSvgDrawComponent';

@Component({
  selector: '[engineering-valve-right]',
  templateUrl: './valve-right.component.html',
  styleUrls: ['./valve-right.component.less']
})
export class ValveRightComponent extends AbstractSvgDrawComponent implements OnInit {

  constructor() {
    super('valveRight');
  }

  ngOnInit() {
  }

}
