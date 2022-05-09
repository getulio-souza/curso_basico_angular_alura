import { Output, EventEmitter } from '@angular/core';


export class AbstractChartActions {

    @Output() onChartClickEmitter = new EventEmitter<Object>();

    public onChartClick(dataArray, name){
        this.onChartClickEmitter.emit({dataArray: dataArray, name: name});
    }

}