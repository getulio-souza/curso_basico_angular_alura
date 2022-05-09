import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-property-summary-curtain',
  templateUrl: './property-summary-curtain.component.html',
  styleUrls: ['./property-summary-curtain.component.scss']
})
export class PropertySummaryCurtainComponent  implements OnChanges {

  panelOpen = false;

  @Input() complete;
  @Input() structure;
  @Input() properties;
  @Input() propertyId;

  @Input() svg;
  @Input() floorIdFromFloorplan;


  @Output() onCardSummaryChangeEmitter = new EventEmitter<any>();
  @Output() onChangeCurtainEmitter = new EventEmitter<any>();

  showFloorDetails = false;


  ngOnChanges(changes: SimpleChanges): void {


  }
  closeCurtain(){
    if(this.svg != null){
      this.panelOpen = false;
      this.floorIdFromFloorplan = null;
      this.onChangeCurtainEmitter.emit({panelOpen: this.panelOpen});
    }
  }
  
  openCurtain() {
    if(this.svg != null){
      //only changes
      this.panelOpen = true;
      this.onChangeCurtainEmitter.emit({panelOpen: this.panelOpen});
    }
  }

  onCardSummaryChange(event){
    if(event != null) {
      //floor has been selected
      this.showFloorDetails = true;
    } else{
      // back button was clicked
      this.showFloorDetails = false;
    }

    this.onCardSummaryChangeEmitter.emit(event);
  }
}