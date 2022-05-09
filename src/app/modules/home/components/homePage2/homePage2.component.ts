import { DateService } from '../../../../services/date/date.service'
import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page2',
  templateUrl: './homePage2.component.html',
  styleUrls: ['./homePage2.component.scss']
})
export class HomePage2Component extends PropertyDataLoader implements OnInit {

  hasLoadedProperties = false;
  isSidebarOpen;
  homePanelOpen = false;
  temperatureUomIsFahrenheit;

  scrollBarConfig;

  indicatorGroups;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService
  ) {

    super(translateService, structureService, propertiesService);

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    this.scrollBarConfig = {};
    this.scrollBarConfig.suppressScrollY = true;

  }

  afterPropertyHasBeenLoaded(){
    this.hasLoadedProperties = true;
    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;

    const homeConfig = this.properties.home;

    if(homeConfig != null){
      this.indicatorGroups = homeConfig.indicatorGroups;
    }

    if(this.indicatorGroups == null){
      this.indicatorGroups = this.getDefaultIndicatorsGrupos();
    }
    
  
    
  }

  ngOnInit(): void {
  }

  getDefaultIndicatorsGrupos(){
    return [
      {
        label: "Financial",
        icon: "attach_money",
        indicators: [
          { id: "sold", label: "Sold", icon: "business" }
        ]
      },
      {
        label: "Operational",
        icon: "playlist_add",
        indicators: [
          { id: "presence", label: "Presence", icon: "person" }
        ]
      }
    ]
  }


}