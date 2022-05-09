import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.scss']
})
export class LevelDetailsComponent  implements OnChanges {

  @Input() properties;
  @Input() selectedFloor;
  @Input() roundValueInfo;
  @Input() structure;
  @Input() propertyId;
  


  propertySubdivisionTabs = [
    {
      id: 'grid',
      name: "Detailed Table"
    }
  ];

  selectedTab = this.propertySubdivisionTabs[0];

  lastClickedUnit;
  showUnitDetails;
  hideGridColumns = [];

  floorPlans;
  temperatureUomIsFahrenheit;
  pressureUomIsPsi;
  gridColumns;
  roomsInfo;

  

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    let propertySummaryConfig = this.properties.propertySummary;
    
    if(propertySummaryConfig != null){
      let floorPlans =  propertySummaryConfig.floorPlans;
      if (floorPlans) {
        this.floorPlans = floorPlans;
      }

      let customColumnsConfig = propertySummaryConfig.customColumns;
      if (customColumnsConfig) {
        this.gridColumns = customColumnsConfig;
      }


      let propertySubdivisionTabs = propertySummaryConfig.propertySubdivisionTabs;
      if(propertySubdivisionTabs) {
        this.propertySubdivisionTabs = propertySubdivisionTabs;
      }

    }

    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.pressureUomIsPsi = this.properties.pressureUomIsPsi;

    
  }

  onClickTab(tab){
    this.selectedTab = tab;
  }
  onUnitClick(itemClicked){

    this.hideGridColumns = itemClicked.hideGridColumns;
    this.lastClickedUnit = itemClicked.unit;
    this.showUnitDetails = true;
  }

  onBackRoomDetail(event) {
    this.lastClickedUnit = null;
    this.showUnitDetails = false;
  }

  onRoomsInfoBuild(roomsInfo){
    this.roomsInfo = roomsInfo;
  }

}
