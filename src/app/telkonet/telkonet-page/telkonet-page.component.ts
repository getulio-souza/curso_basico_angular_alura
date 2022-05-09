import { Component, OnInit } from '@angular/core';
import { PropertyDataLoader } from '../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-telkonet-page',
  templateUrl: './telkonet-page.component.html',
  styleUrls: ['./telkonet-page.component.less']
})
export class TelkonetPageComponent extends PropertyDataLoader implements OnInit {

  iframeUrl;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private sanitizer: DomSanitizer) {

    super(translateService, structureService, propertiesService);

    this.loadData(()=>{
      this.afterPropertyHasBeenLoaded();
    })
  }

  ngOnInit() {
  }

  afterPropertyHasBeenLoaded() {
    const telkonetConfig = this.properties.energymanagement;

    if(telkonetConfig != null){
      if(telkonetConfig.iframeUrl != null){
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(telkonetConfig.iframeUrl);;
      }
    }

    if(this.iframeUrl == null){
      console.error("Component TelkonetPage expected a config energymanagement.iframeUrl but this value is null");
    }

  }

}
