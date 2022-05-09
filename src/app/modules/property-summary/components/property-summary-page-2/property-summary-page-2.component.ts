import { PropertySummaryState } from './../../services/propertySummaryState/roperty-summary-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { TranslateService } from '@ngx-translate/core';
import { StructureService } from '@alis/tracking-ng';
import { PropertiesService, AssetsService } from '@alis/ng-services';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-property-summary-page2',
  templateUrl: './property-summary-page-2.component.html',
  styleUrls: ['./property-summary-page-2.component.less']
})
export class PropertySummaryPageComponent2 extends PropertyDataLoader implements OnInit, OnDestroy {

  isSidebarOpen;

  hasLoadedProperties = false;
  temperatureUomIsFahrenheit;
  bodyOverflowHidden = document.getElementsByTagName('body')[0];
  homeSidebar = document.getElementById('sideBar');
  homePage = document.getElementById('homePage');
  barBottomProperty = document.getElementById('home-summary');
  widthScreen = window.innerWidth;

  svg;
  svgString;
  finishSvgRequest = false;

  floorIdFromCurtain;
  floorFromPropertySummaryCurtain;

  isCurtainOpen;

  isLoadingSummaries = false;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private router: Router,
    private propertySummaryState: PropertySummaryState,
    private activatedRoute: ActivatedRoute,
    private assetsService: AssetsService) {

    super(translateService, structureService, propertiesService);
    //this.bodyOverflowHidden.classList.add('overflowHidden');

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

    this.propertySummaryState.isLoadingSummaries$.subscribe( isLoading => {
      this.isLoadingSummaries = isLoading;
      this.floorIdFromCurtain = null;
    })

  }

  ngOnInit() {
    setTimeout(
      ()=>{
        this.homeSidebar.classList.remove('slide-in-left')
      },
      2000
    )
  }

  ngOnDestroy() {
    //this.bodyOverflowHidden.classList.remove('overflowHidden');
  }

  afterPropertyHasBeenLoaded() {

    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.hasLoadedProperties = true;

    this.buildBackground();
    
    this.homeSidebar = document.getElementById('sideBar');
    if (this.homeSidebar) {
      this.homeSidebar.classList.add('slide-in-left');
    }
    if (this.homePage) {
      this.homePage.classList.add('fade-in');
    }
    if (this.barBottomProperty) {
      this.barBottomProperty.classList.add('slide-in-bottom');
    }
  }

  onPropertyDetailsClick() {
    this.router.navigate(['propertySummary'], { relativeTo: this.activatedRoute.parent });
  }

  // Floors can change by the following 2 methods:
  // 1- by svg click
  // 2- curtain click (card or round buttons)

  /**
   * 
   * @param event the floorId from map changed
   */
  onFloorIdFromMapChange(event){
    this.floorIdFromCurtain = event;
  }

  /**
   * 
   * @param event the floor clicked in property curtain component
   */
  onCardSummaryChange(event){
    this.floorFromPropertySummaryCurtain = event;
  }
  
  onChangeCurtain(event){
    this.isCurtainOpen = event.panelOpen;
  }

  buildBackground(){
    const propertySummaryConfig = this.properties.propertySummary;
    const propertyMap = propertySummaryConfig.propertyMap;

    // loads filename for map background
    let fileName = null;
    if(propertyMap != null ){
      fileName = propertyMap.svg;
    }
    if (!fileName) {
      // no background configured: nothing to do
      this.finishSvgRequest = true;
      return;
    }
 
    this.assetsService.getSvgAssetAsString(this.propertyId,fileName)
    .pipe(
      finalize(() => {
        this.finishSvgRequest = true;
      })
    ).
    subscribe((res) => {
      this.svgString = res;

      if(this.svgString != null){
        // in case we received a svgString
        // it should not show background
        this.backgroundStyle = {};
      }

    }, (error) => {
      console.error("Could not get svg '" + fileName + "'" + " from propertyId '" + this.propertyId + "'");
    });

  }
}