import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
} from "@angular/core";

export interface CollumnDefinition {
  field: string;
  header: string;
}

interface Options {
  label: string;
  value: string;
}

export interface GridOrderData {
  category: string;
  item: string;
  sector: string;
  location: string;
  created: string;
  updated: string;
  finished: string;
  estimated: string;
  doneTime: string;
  user: string;
}

export interface GridNPSData extends GridOrderData {}

@Component({
  selector: "app-collapse-grid",
  templateUrl: "./collapse-grid.component.html",
  styleUrls: ["./collapse-grid.component.scss"],
})
export class CollapseGridComponent implements OnInit, AfterViewInit {
  panelHeightInitial = "70px";

  @Output() gridFilterSelected: EventEmitter<string> =
    new EventEmitter<string>();
  @Input() data: any[] = [{}];

  @Input() cols: CollumnDefinition[];
  @Input() filters: Options[];
  @Input() filterSelected: string;

  panelOpen: boolean = false;
  showDataButton: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.selectGraphics(this.filters[0]);
  }

  selectGraphics(event): void {
    this.filterSelected = event;
    this.gridFilterSelected.emit(event);
  }

  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }
}
