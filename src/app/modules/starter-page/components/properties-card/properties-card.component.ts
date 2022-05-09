import { ContextService } from './../../../../services/context/context.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { StructureService } from '@alis/tracking-ng';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-properties-card',
  templateUrl: './properties-card.component.html',
  styleUrls: ['./properties-card.component.scss']
})
export class PropertiesCardComponent implements OnInit, OnDestroy, OnChanges {

  private static THUMBNAILS_FOLDER_PATH = 'assets/images/thumbnails/';

  @Input() propertyIds: Array<string>;
  @Output() onEnterPropertyButtonEmitter = new EventEmitter<any>();

  properties: Array<any>;
  body = document.getElementsByTagName('body')[0];
  showConfigError = false;

  constructor(private structureService: StructureService, private router: Router, private contextService: ContextService) { }

  ngOnInit() {
    this.body.classList.add('bg-login');
    this.buildPropertiesCard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildPropertiesCard();
  }
  ngOnDestroy() {
    this.body.classList.remove('bg-login');
  }

  buildPropertiesCard() {
    this.showConfigError = false;
    this.properties = new Array();

    this.contextService.moreThanOnePropertyOption = false;

    let requests = [];
    this.propertyIds.forEach((propertyId) => {
      requests.push(this.structureService.getStructure(propertyId));
    });

    forkJoin(requests).subscribe((structures: Array<any>) => {
      this.properties = new Array();
      for (let i = 0; i < structures.length; i++) {
        let propertyId = this.propertyIds[i];

        if(structures[i] == null) {
          console.debug("Could not get structure for propertyId '" + this.propertyIds[i] + "'")
          continue;
         }

        let name = structures[i].name != null ? structures[i].name : structures[i].id;
        this.properties.push({
          propertyId: propertyId,
          name: name,
          thumbnailPath: PropertiesCardComponent.THUMBNAILS_FOLDER_PATH + propertyId + '.jpg'
        })
      }


      if(this.properties.length == 0) {
        this.showConfigError = true;
        console.warn("There are available properties for your account (" + this.propertyIds + ") but structure configs were not found. Check structure service.")
        this.router.navigateByUrl("/noRegisteredProperty");
      } else
       if(this.properties.length == 1) {
        // only one property
        const propertyId = this.properties[0].propertyId;
        console.debug("There is only property ('" + propertyId  + "'), lets go directly to initial page")
        this.router.navigateByUrl("/propertyApp/" + propertyId);
      } else {
        this.contextService.moreThanOnePropertyOption = true;
      }
    });

  }
  onClickProperty(property) {
    const cardsProperties = document.querySelector('#cards-container');
    cardsProperties.classList.add('slide-out-blurred-top');
    setTimeout(() => {
      this.onEnterPropertyButtonEmitter.emit({ selectedPropertyId: property.propertyId });
    }, 400);
  }

}
