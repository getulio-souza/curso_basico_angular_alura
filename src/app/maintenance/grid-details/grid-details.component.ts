import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-grid-details',
  templateUrl: './grid-details.component.html',
  styleUrls: ['./grid-details.component.scss']
})
export class GridDetailsComponent implements OnInit {
  panelOpen = false;

  @Input() data;
  @Input()showDataButton = false;
  customColumns;
  panelHeightInitial;

  cols = [
    { field: 'status',      header: 'Status' },
    { field: 'location',    header: 'Location' },
    { field: 'description', header: 'Description' },
    { field: 'timestamp',   header: 'Last Updated' }
  ];

  constructor() {
    this.panelHeightInitial = '70px';
  }

  ngOnInit() {
  }

  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }

}
