import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '@alis/ng-services';
import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../home/propertyDataLoader';

@Component({
  selector: 'app-property-summary-page',
  templateUrl: './property-summary-page.component.html',
  styleUrls: ['./property-summary-page.component.less']
})
export class PropertySummaryPageComponent extends PropertyDataLoader {

  ready = false;
  constructor(
    propertiesService: PropertiesService,
    translateService: TranslateService,
    structureService: StructureService) {

    super(translateService,structureService, propertiesService);

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    
  }


  afterPropertyHasBeenLoaded() {
    this.ready = true;
  }


}
