import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() imgSrc: string = '../../assets/images/loading.gif';
  @Input() isFull: boolean = true;

  constructor() {}

  ngOnInit() {}
}
