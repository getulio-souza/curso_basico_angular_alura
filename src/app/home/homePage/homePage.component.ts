import {Router, ActivatedRoute} from '@angular/router';
import {PropertyDataLoader} from '../propertyDataLoader';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PropertiesService} from '@alis/ng-services';
import {StructureService} from '@alis/tracking-ng';
import {trigger, transition, animate, style} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.less'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('2000ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('2000ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class HomePageComponent extends PropertyDataLoader implements OnInit, OnDestroy {

  isSidebarOpen;

  showPropertyDetails = false;
  hasLoadedProperties = false;
  temperatureUomIsFahrenheit;
  bodyOverflowHidden = document.getElementsByTagName('body')[0];
  homeSidebar = document.getElementById('sideBar');
  homePage = document.getElementById('homePage');
  barBottomProperty = document.getElementById('home-summary');
  widthScreen = window.innerWidth;

  constructor(
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    super(translateService, structureService, propertiesService);
    this.bodyOverflowHidden.classList.add('overflowHidden');

    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

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
    this.bodyOverflowHidden.classList.remove('overflowHidden');
  }

  afterPropertyHasBeenLoaded() {
    this.temperatureUomIsFahrenheit = this.properties.temperatureUomIsFahrenheit;
    this.hasLoadedProperties = true;


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

}


