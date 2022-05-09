import { Component, OnInit } from '@angular/core';
import { AbstractSvgDrawComponent } from '../../abstracts/abstractSvgDrawComponent';

@Component({
  selector: '[engineering-valve-left]',
  templateUrl: './valve-left.component.html',
  styleUrls: ['./valve-left.component.less']
})
export class ValveLeftComponent extends AbstractSvgDrawComponent implements OnInit {

  constructor() {
    super('valveLeft');
  }

  ngOnInit() {
  }

}
