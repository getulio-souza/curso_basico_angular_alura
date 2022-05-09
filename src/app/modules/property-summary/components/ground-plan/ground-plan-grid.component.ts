import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ground-plan-grid',
  templateUrl: './ground-plan-grid.component.html',
  styleUrls: ['./ground-plan-grid.component.scss']
})
export class GroundPlanGridComponent implements OnInit, OnChanges {

  @Input() floorPlans;
  @Input() selectedFloor;
  @Input() propertyId;
  @Input() temperatureUomIsFahrenheit;
  @Input() roomsInfo;
  @Input() field;
  @Input() properties;
  @Input() columns: Array<any>;
  @Input() hideGridColumns = [];

  showColumnChart = false;

  ngOnInit() {
    if (!this.floorPlans) {
      return;
    }
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes.hideGridColumns != null && changes.hideGridColumns.currentValue != null) {
      this.checkHideColumnsChange();
    }
    if (this.field == null || this.field == undefined) {
      // initally set 2nd value
      this.updateFieldAsDefault();
    }

    if (!this.floorPlans) {
      return;
    }
  }

  checkHideColumnsChange() {
    //previously we have selected a field
    //that should be hidden for this floor
    //so, lets change selected field to default (2nd column)
    if (this.hideGridColumns != null && this.hideGridColumns.includes(this.field)) {
      this.updateFieldAsDefault();
    }
  }
  updateFieldAsDefault() {
    if(this.columns != null) {
      if(this.columns.length > 1){
        this.field = this.columns[1].field;
      } else if(this.columns.length == 1){
        this.field = this.columns[0].field;
      }
    }
  }

  constructor() {

  }



  onClickColumn(column) {
    this.field = column.field;
  }

}
