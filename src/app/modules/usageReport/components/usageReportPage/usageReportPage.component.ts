import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-usage-report-page',
  templateUrl: './usageReportPage.component.html',
  styleUrls: ['./usageReportPage.component.scss']
})
export class UsageReportPageComponent extends PropertyDataLoader implements OnInit {

  totalUnitsLevel0;

  selectedFloor;
  showGrid;  

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService
  ) {

    super(translateService, structureService, propertiesService);

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

  }

  afterPropertyHasBeenLoaded(){
    let allStructures = this.structureService.getAllStructIdsByGivenStructureAndLevel(this.structure,0);
    this.totalUnitsLevel0 = allStructures.size;
  }

  ngOnInit(): void {
  }

  onChangeStructureFilter(filtered){
    this.selectedFloor = filtered;
  }

  onGridClick(event){
    this.showGrid = event.showGrid;
  }

}