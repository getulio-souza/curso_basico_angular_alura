import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { PropertyDataLoader } from '../home/propertyDataLoader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent extends PropertyDataLoader implements OnInit {

  availableEnergyGroups = [];
  selectedEnergyGroup;
  isSidebarOpen;

  weekProfileNumberOfWeeks;
  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService
  ) {
    super(translateService,structureService, propertiesService);

    this.loadData(()=>{
      this.afterPropertyHasBeenLoaded();
    });
  }

  public afterPropertyHasBeenLoaded() {

    
    this.selectedEnergyGroup = this.properties.propertyId;

    const energymanagement = this.properties.energymanagement
    if(energymanagement && energymanagement.numberOfWeeks) {
      this.weekProfileNumberOfWeeks = energymanagement.numberOfWeeks;
    } else {
      console.warn("Could not find 'energymanagement.numberOfWeeks' in properties file. Using 12 as default");
      this.weekProfileNumberOfWeeks = 12;
    }
  }

  ngOnInit() {

    this.availableEnergyGroups = new Array();

    this.availableEnergyGroups.push(this.propertyId);

  }

  onEnergyGroupChange(energyGroup) {
    this.selectedEnergyGroup = energyGroup;
  }


}
