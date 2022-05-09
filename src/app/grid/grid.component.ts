import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'proxper-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent implements OnInit , OnChanges {
  @ViewChild(Table, {static: false}) table: Table;

  @Input() data;
  @Input() customColumns;
  @Input() showDataButton = true;
  @Input() paginator = false;
  @Input() rowNumber = 10;
  @Input() multiSortMeta = [];
  @Input() hideGridColumns;
  @Input() buttonTitle: string;

  @Output() onGridItemEmitter = new EventEmitter<Object>();

  selectedRoom;

  showTempInFahrenheit;

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'active-profile-label', header: 'Sold' },
    { field: 'presence', header: 'Occupied' },
    { field: 'setpointLabel', header: 'Setpoint' },
    { field: 'temperatureLabel', header: 'Temperature' },
    { field: 'consumptionLastHourLabel', header: 'kWh' },
    { field: 'timestamp', header: 'Last Updated' }
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.customColumns && changes.customColumns.currentValue) {
      this.cols = this.customColumns;
    }
  }

  ngOnInit() {
    if(this.customColumns){
      this.cols = this.customColumns;
    }

    // if no custom sort was received
    // use default
    if(this.multiSortMeta == null || this.multiSortMeta.length == 0 ){
      this.cols.forEach(col => {
        this.multiSortMeta.push({field: col.field, order:1});
      });
    }

    if (this.hideGridColumns == null) {
      this.hideGridColumns = new Array();
    }
  }

  onSelectRoom(_, selectedRoom) {
    this.selectedRoom = selectedRoom;
    this.onGridItemEmitter.emit(this.selectedRoom);
  }

  exportCSV() {
    const removeAcento = (text: string) => {       
      text = text.toLowerCase();                                                         
      text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
      text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
      text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
      text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
      text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
      text = text.replace(new RegExp('[Ç]','gi'), 'c');
      return text;                 
    }

    let data = this.data;
    let columns = this.customColumns.length ? this.customColumns : this.cols;
    let csv = '';
    const csvSeparator = ',';

    //headers
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      if (column.exportable !== false && column.field) {
        csv += removeAcento('"' + (column.header || column.field) + '"');
        if (i < (columns.length - 1)) {
          csv += csvSeparator;
        }
      }
    }

    //body
    data.forEach(function (record, _) {
      csv += '\n';
      for (var i_1 = 0; i_1 < columns.length; i_1++) {
        var column = columns[i_1];

        var cellData = record[column.field];

        if ((typeof cellData) === 'object' && cellData !== null) {
          if (cellData instanceof Date) {
            cellData = cellData.toLocaleString('pt-BR');
          }
        }

        if (cellData != null) {
          cellData = removeAcento(cellData);
          cellData = String(cellData).replace(/"/g, '""');
        } else {
          cellData = '';
        }

        csv += '"' + cellData + '"';
        if (i_1 < (columns.length - 1)) {
          csv += csvSeparator;
        }
      }
    });
    
    var link = document.createElement("a");
    link.style.display = 'none';
    document.body.appendChild(link);
    csv = 'data:text/csv;charset=utf-8,' + csv;
    window.open(encodeURI(csv));
    document.body.removeChild(link);
  };
}
