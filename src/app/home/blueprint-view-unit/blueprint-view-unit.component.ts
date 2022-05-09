import { Component, OnInit } from '@angular/core';
import { AbstractComponentToBeDrawn } from '@alis/proxper-base';

@Component({
  selector: 'app-blueprint-view-unit',
  templateUrl: './blueprint-view-unit.component.html',
  styleUrls: ['./blueprint-view-unit.component.less']
})
export class BlueprintViewUnitComponent extends AbstractComponentToBeDrawn {
  constructor() { 
    super();
  }
  
  ngOnInit() {
   
  }
}
