import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid-state',
  templateUrl: './grid-state.component.html',
  styleUrls: ['./grid-state.component.scss']
})
export class GridStateComponent implements OnInit {

  @Input() column;
  @Input() room;
  
  constructor() { }

  ngOnInit() {
  }

  isValid(value) : boolean {
    return (value != null && value != "N/A" && value != "invalid");
  }

}
