import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '@alis/ng-services';
import { PropertyDataLoader } from '../../home/propertyDataLoader';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-optimization',
  templateUrl: './optimizationPage.component.html',
  styleUrls: ['./optimizationPage.component.less']
})
export class OptimizationPageComponent extends PropertyDataLoader implements OnInit {

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    ) {

    super(translateService, structureService, propertiesService);
    this.loadData(()=>{
      this.afterPropertyHasBeenLoaded();
    });

  }

  ngOnInit() {
  }

  public afterPropertyHasBeenLoaded() {
  }

}
