import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit , OnChanges{
  @Input() disabled: boolean = false;
  @Input() items: string[];
  @Input() selected: string;
  @Input() caption: string;
  @Output() selectedModified = new EventEmitter<string>();

  list: string[] = [];

  constructor() { }

  ngOnInit() {
    this.selected = null;
  }  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.selected = null;
      this.list = this.items;
    }
  }

  pick(selected: string) {
    this.selected = selected;
    this.selectedModified.emit(selected);
  }

  clearSelected(): void {
    this.selected = null;
  }
}
