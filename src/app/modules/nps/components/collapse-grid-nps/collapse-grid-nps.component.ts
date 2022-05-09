import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';

export interface CollumnDefinition {
    field: string;
    header: string;
}

export interface GridNPSData {
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

@Component({
  selector: 'app-collapse-grid-nps',
  templateUrl: './collapse-grid-nps.component.html',
})
export class CollapseGridNPSComponent implements OnInit , AfterViewInit {
    panelHeightInitial = '70px';

    @Output() gridFiltroSelecionado: EventEmitter<string> = new EventEmitter<string>();
    @Input() data: any[] = [{}];

    cols: CollumnDefinition[] = [
        { field: 'category', header: 'CATEGORIA PESQUISA'},
        { field: 'researchTitle', header: 'PESQUISA'},
        { field: 'researchDateHour', header: 'DATA/HORA PESQUISA'},
        { field: 'sector', header: 'SECTOR'},
        { field: 'ward', header: 'ALA / QUARTO'},
        { field: 'researchResult', header: 'RESULTADO DA PESQUISA'},
        { field: 'researchQuestions', header: 'PERGUNTAS PESQUISA E NOTA'},
        { field: 'researchNotes', header: 'COMENTÁRIOS / OBSERVAÇÕES'}
    ];

    panelOpen: boolean = false;
    showDataButton: boolean = true;

    filtros: string[] = [
        'NPS Satisfação Global',
        'NPS de Pedidos Fechados',
        'NPS por Categoria',
        "Top 5 Categorias com NPS Detractor (Abaixo de 7)"
    ];

    filtroSelecionado: string = null;

    constructor() {}

    ngOnInit(): void { }

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
