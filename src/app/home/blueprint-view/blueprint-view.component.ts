import { BlueprintViewUnitComponent } from './../blueprint-view-unit/blueprint-view-unit.component';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'home-blueprint-view',
  templateUrl: './blueprint-view.component.html',
  styleUrls: ['./blueprint-view.component.less']
})
export class BlueprintViewComponent implements OnInit, OnChanges {

  @Input() blueprintInfo;
  @Input() roomsInfo;

  selectedRoom;

  customClass = BlueprintViewUnitComponent;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(model) {
    
  }

  onSaveBlueprint(event) {
    console.log("blueprint has been saved")
  }

  onBlueprintUnitClick(event) {
    this.selectedRoom = event.roomInfo;
  }
  
}
