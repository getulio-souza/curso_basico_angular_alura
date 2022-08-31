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

  @Output() gridFiltroSelecionado: EventEmitter<string> =
    new EventEmitter<string>();
  @Input() data: any[] = [{}];

  cols: CollumnDefinition[] = [
    { field: "category", header: "CATEGORIA PEDIDO" },
    { field: "item", header: "ITEM" },
    { field: "sector", header: "SECTOR" },
    { field: "location", header: "ALA/QUARTO" },
    { field: "created", header: "DATA/HORA STATUS ABERTURA PEDIDO" },
    { field: "updated", header: "DATA/HORA STATUS MUDANÇA STATUS PEDIDO" },
    { field: "finished", header: "DATA/HORA STATUS ENCERRAMENTO PEDIDO" },
    { field: "estimated", header: "TEMPO ESTIMADO RESOLUÇÃO" },
    { field: "doneTime", header: "TEMPO EFETIVO RESOLUÇÃO" },
    { field: "user", header: "USUÁRIO RESPONSÁVEL PELO PEDIDO" },
  ];

  panelOpen: boolean = false;
  showDataButton: boolean = true;

  filtros: string[] = [
    "Pedidos por Situação x Tempo de Espera",
    "Pedidos finalizados fora do SLA por Área",
    "Pedidos por Área",
    "Pedidos por Ala",
  ];

  filtroSelecionado: string = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.selecionarGrafico(this.filtros[0]);
  }

  selecionarGrafico(event): void {
    this.filtroSelecionado = event;
    this.gridFiltroSelecionado.emit(event);
  }

  onShowContentGrid() {
    this.panelOpen = !this.panelOpen;
  }
}
