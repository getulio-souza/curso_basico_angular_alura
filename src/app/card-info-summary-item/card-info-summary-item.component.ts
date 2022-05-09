import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-info-summary-item',
  templateUrl: './card-info-summary-item.component.html',
  styleUrls: ['./card-info-summary-item.component.scss']
})
export class CardInfoSummaryItemComponent implements OnInit {

  @Input() bgColor: string;
  @Input() icon: string;
  @Input() category: string;
  @Input() value: string;

  @ViewChild('iconDiv', {static: false}) iconDiv: ElementRef<HTMLDivElement>

  constructor() { }

  ngOnInit() {
    this.iconDiv.nativeElement.style.backgroundColor = this.bgColor;
  }


}
