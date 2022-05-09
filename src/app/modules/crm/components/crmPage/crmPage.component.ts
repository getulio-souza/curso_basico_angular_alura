import { DateService } from './../../../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-crm-page',
  templateUrl: './crmPage.component.html',
  styleUrls: ['./crmPage.component.scss']
})
export class CRMPageComponent extends PropertyDataLoader implements OnInit {

  surveyConfig;

  dateRange: Date[];

  startDate: Date;
  endDate: Date;
  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private dateService: DateService
  ) {

    super(translateService, structureService, propertiesService);

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    propertiesService.getAppConfig().subscribe((config) => {
      const crmConfig = config['crm'];
      if (crmConfig != null) {
        this.surveyConfig = crmConfig;
        console.info("Using the following surveyConfig", this.surveyConfig);
      }
    });


    this.dateRange = [];
    this.dateRange[0] = new Date(this.dateService.getBeginOfGivenYear(Date.now()));
    this.dateRange[1] =  new Date(this.dateService.getEndOfGivenYear(Date.now()));
    
    this.startDate = this.dateRange[0];
    this.endDate = this.dateRange[1];

  }

  afterPropertyHasBeenLoaded(){
    
  }

  ngOnInit(): void {
  }

  getData(){
    if (!this.dateRange || !this.dateRange[0] || !this.dateRange[1]) {
      return;
    }

    this.startDate = new Date(this.dateService.getStartOfDay(this.dateRange[0].getTime()));
    this.endDate = new Date( this.dateService.getEndOfDay(this.dateRange[1].getTime()) );

  }

}