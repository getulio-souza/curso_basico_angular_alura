import { AssetsService } from '@alis/ng-services';
import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';


@Component({
  selector: 'app-floor-plan-svg',
  templateUrl: './floor-plan-svg.component.html',
  styleUrls: ['./floor-plan-svg.component.scss']
})
export class FloorPlanSvgComponent implements OnInit, OnChanges {

  @Input() roomsInfo;
  @Input() floor;
  @Input() field;
  @Input() propertyId;
  @Input() properties;

  floorPlans = [];
  unitName;
  svgFloorPlan;
  svgFloorPlanMap = new Map<string, string>();

  rectX;
  rectY;
  rectWidth;
  rectHeight;
  value;

  constructor(private assetsService: AssetsService) {
  }

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.floorPlans = this.properties.propertySummary.floorPlans;
    this.svgFloorPlan = document.getElementById('svgFloorPlan');

    this.floorPlans.forEach(floorPlan => {
      let svg = floorPlan.svg;
      // unitId, ids dos andares da unidade (ex: deltixboutiquehotel.terreo)
      floorPlan.units.forEach((unitId) => {
        this.svgFloorPlanMap.set(unitId, svg);
      });
    });

    // get svg and build data svg
    this.getDataSvg();

 

  }

  // build html para o svg
  buildDataHtmlSvg() {
    return `
    <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
        <div class="floor-plan-icon">${this.value} ${this.unitName}</div>
    </foreignObject>`;
  }

  buildHtmlSold() {
    return `
    <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
      <div class="floor-plan-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.6 55.6">                        
        <circle cx="27.8" cy="27.8" r="27.8" style="fill:#00dca9"/>
        <path d="M31.32,33.34a2.48,2.48,0,0,0-.1-.9,1.79,1.79,0,0,0-.5-.7,5.55,5.55,0,0,0-.8-.6,3.92,3.92,0,0,0-1.3-.5,12.24,12.24,0,0,1-2.3-1,6.66,6.66,0,0,1-3-2.7,4.64,4.64,0,0,1-.4-2.1,3.81,3.81,0,0,1,.4-1.9,4,4,0,0,1,1-1.5,5.59,5.59,0,0,1,3.7-1.6v-2.7h2.1v2.7a6.64,6.64,0,0,1,2,.6,6.1,6.1,0,0,1,1.6,1.2,4.25,4.25,0,0,1,1,1.7,8,8,0,0,1,.3,2.3h-3.8a3.4,3.4,0,0,0-.6-2.2,2.06,2.06,0,0,0-1.7-.7,3,3,0,0,0-1,.2,1.79,1.79,0,0,0-.7.5,1.61,1.61,0,0,0-.4.7,2.77,2.77,0,0,0-.1.9,2,2,0,0,0,.1.8,1.16,1.16,0,0,0,.5.7c.3.2.5.4.8.6s.8.4,1.3.6c.8.3,1.6.7,2.3,1a5.67,5.67,0,0,1,1.8,1.2,4.81,4.81,0,0,1,1.2,1.6,4.64,4.64,0,0,1,.4,2.1,4.48,4.48,0,0,1-.4,2,5.6,5.6,0,0,1-1,1.5,5.37,5.37,0,0,1-1.6,1,6.48,6.48,0,0,1-2.1.5v2.5h-2.1v-2.5a8,8,0,0,1-2.1-.5A5.44,5.44,0,0,1,24,37a8.32,8.32,0,0,1-1.3-1.8,6.69,6.69,0,0,1-.5-2.6H26a6.05,6.05,0,0,0,.2,1.5,3.49,3.49,0,0,0,.6.9,4.05,4.05,0,0,0,.9.5,3.4,3.4,0,0,0,1,.1,3.59,3.59,0,0,0,1.1-.2,5.94,5.94,0,0,0,.8-.4,1.79,1.79,0,0,0,.5-.7A3.55,3.55,0,0,0,31.32,33.34Z" transform="translate(-0.87 -1.34)" style="fill:#fff"/></svg>                        
        ${this.unitName}
      </div>
    </foreignObject>`;
  }

  buildHtmlUnsold() {
    return `
    <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
     <div class="floor-plan-icon">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.6 55.6">                          
         <circle cx="27.8" cy="27.8" r="27.8" style="fill:#434c58"/>
         <path d="M31.32,33.34a2.48,2.48,0,0,0-.1-.9,1.79,1.79,0,0,0-.5-.7,5.55,5.55,0,0,0-.8-.6,3.92,3.92,0,0,0-1.3-.5,12.24,12.24,0,0,1-2.3-1,6.66,6.66,0,0,1-3-2.7,4.64,4.64,0,0,1-.4-2.1,3.81,3.81,0,0,1,.4-1.9,4,4,0,0,1,1-1.5,5.59,5.59,0,0,1,3.7-1.6v-2.7h2.1v2.7a6.64,6.64,0,0,1,2,.6,6.1,6.1,0,0,1,1.6,1.2,4.25,4.25,0,0,1,1,1.7,8,8,0,0,1,.3,2.3h-3.8a3.4,3.4,0,0,0-.6-2.2,2.06,2.06,0,0,0-1.7-.7,3,3,0,0,0-1,.2,1.79,1.79,0,0,0-.7.5,1.61,1.61,0,0,0-.4.7,2.77,2.77,0,0,0-.1.9,2,2,0,0,0,.1.8,1.16,1.16,0,0,0,.5.7c.3.2.5.4.8.6s.8.4,1.3.6c.8.3,1.6.7,2.3,1a5.67,5.67,0,0,1,1.8,1.2,4.81,4.81,0,0,1,1.2,1.6,4.64,4.64,0,0,1,.4,2.1,4.48,4.48,0,0,1-.4,2,5.6,5.6,0,0,1-1,1.5,5.37,5.37,0,0,1-1.6,1,6.48,6.48,0,0,1-2.1.5v2.5h-2.1v-2.5a8,8,0,0,1-2.1-.5A5.44,5.44,0,0,1,24,37a8.32,8.32,0,0,1-1.3-1.8,6.69,6.69,0,0,1-.5-2.6H26a6.05,6.05,0,0,0,.2,1.5,3.49,3.49,0,0,0,.6.9,4.05,4.05,0,0,0,.9.5,3.4,3.4,0,0,0,1,.1,3.59,3.59,0,0,0,1.1-.2,5.94,5.94,0,0,0,.8-.4,1.79,1.79,0,0,0,.5-.7A3.55,3.55,0,0,0,31.32,33.34Z" transform="translate(-0.87 -1.34)" style="fill:#fff"/></svg>                        
        ${this.unitName}
     </div>
   </foreignObject>`;
  }

  buildHtmlPresence() {
    if (this.value == 'true') {
      return `
      <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.6 55.6">
          <circle cx="27.8" cy="27.8" r="27.8" style="fill:#00dca9"/>
          <circle cx="27.84" cy="21.88" r="5.87" style="fill:#fcfcfc"/>
          <path d="M16.77,40.68a5.66,5.66,0,0,1,.89-4.2c1.46-1.74,6.5-4,10.66-3.85,6.94.17,10.48,3,11.4,4.18s.66,3.9.66,3.9Z" transform="translate(-0.75 -1.11)" style="fill:#fcfcfc"/></svg>        
        ${this.unitName}
       </div>
   </foreignObject>`;
    } else if (this.value == 'false') {
      return `
     <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 57.1 57.8" style="enable-background:new 0 0 57.1 57.8;" xml:space="preserve">
          <circle style="fill:#434C58;" cx="28.5" cy="28.9" r="27.8"/>
          <g>
          <circle style="fill:#FCFCFC;" cx="28.6" cy="23" r="5.9"/>
          <path style="fill:#FCFCFC;" d="M16.8,40.7c0,0-0.5-2.6,0.9-4.2c1.5-1.7,6.5-4,10.7-3.9c6.9,0.2,10.5,3,11.4,4.2c0.9,1.2,0.7,3.9,0.7,3.9L16.8,40.7z"/>
          </g>
        </svg>
        ${this.unitName}
       </div>
   </foreignObject>`;
    }
  }

  buildHtmlDoorSensor() {
    if (this.value == 'opened') {
      return `
      <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">      
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 56.7 57" style="enable-background:new 0 0 56.7 57;" xml:space="preserve">
      <g>
      <circle style="fill:#00DCA9;" cx="28.4" cy="28.5" r="27.8"/>
      <path style="fill:#FCFCFC;" d="M28.4,34.8c1.2,0,2.3-1,2.3-2.3c0-1.2-1-2.3-2.3-2.3s-2.3,1-2.3,2.3C26.1,33.7,27.1,34.8,28.4,34.8z
       M35.2,24.5H34v-2.3c0-3.1-2.5-5.7-5.7-5.7s-5.7,2.5-5.7,5.7h2.2c0-1.9,1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5v2.3H21.5
      c-1.2,0-2.3,1-2.3,2.3v11.3c0,1.2,1,2.3,2.3,2.3h13.6c1.2,0,2.3-1,2.3-2.3V26.8C37.4,25.6,36.4,24.5,35.2,24.5z M35.2,38.2H21.5
      V26.8h13.6V38.2z"/>
      </g>
      </svg>
      
        ${this.unitName}
       </div>
   </foreignObject>`;
    }
    else if (this.value == 'closed') {
      return `
      <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
       <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 56.7 57" style="enable-background:new 0 0 56.7 57;" xml:space="preserve">
        <g>
        <circle style="fill:#e65452;" cx="28.4" cy="28.5" r="27.8"/>
        <path style="fill:#FCFCFC;" d="M35.3,24.5h-1.2v-2.3c0-3.2-2.6-5.8-5.8-5.8s-5.8,2.6-5.8,5.8v2.3h-1.2c-1.3,0-2.3,1-2.3,2.3v11.5
        c0,1.3,1,2.3,2.3,2.3h13.8c1.3,0,2.3-1,2.3-2.3V26.8C37.6,25.5,36.5,24.5,35.3,24.5z M28.4,34.8c-1.3,0-2.3-1-2.3-2.3
        c0-1.3,1-2.3,2.3-2.3c1.3,0,2.3,1,2.3,2.3C30.7,33.8,29.6,34.8,28.4,34.8z M31.9,24.5h-7.1v-2.3c0-2,1.6-3.6,3.6-3.6
        s3.6,1.6,3.6,3.6V24.5z"/>
        </g>
        </svg>
        ${this.unitName}
       </div>
   </foreignObject>`;
    }
  }

  buildHtmlSwitchState() {
    if (this.value == 'true') {
      return `
      <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
       <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 56.7 57" style="enable-background:new 0 0 56.7 57;" xml:space="preserve">
        <g>
        <circle style="fill:#00DCA9;" cx="28.4" cy="28.5" r="27.8"/>
        <path style="fill:#FCFCFC;" d="M33.8,21.8l0-5.4H31v5.4h-5.4v-5.4H23v5.4h0c-1.3,0-2.7,1.3-2.7,2.7v7.4l4.7,4.7v4h6.7v-4l4.7-4.7
        v-7.4C36.4,23.1,35.1,21.8,33.8,21.8z"/>
        </g>
        </svg>
        ${this.unitName}
       </div>
   </foreignObject>`;
    } else if (this.value == 'false') {
      return `
      <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
       <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 56.7 57" style="enable-background:new 0 0 56.7 57;" xml:space="preserve">
      <g>
      <circle style="fill:#e65452;" cx="28.4" cy="28.5" r="27.8"/>
      <path style="fill:#FCFCFC;" d="M36.7,31.2v-7.3c0-1.3-1.3-2.7-2.7-2.7v-5.3h-2.7v5.3h-5.3v-5.3h-2.7v3.3l12.7,12.7L36.7,31.2z
       M34.4,33.5L22.3,21.4l0,0L18,17.2l-1.7,1.7l4.5,4.5c0,0.2-0.1,0.3-0.1,0.5v7.3l4.7,4.7v4h6.7v-4l0.6-0.6l6,6l1.7-1.7
      C40.4,39.5,34.4,33.5,34.4,33.5z"/>
      </g>
      </svg>
        ${this.unitName}
       </div>
   </foreignObject>`;
    }
  }

  buildHtmlUndefined() {
    return `
     <foreignObject x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}">
       <div class="floor-plan-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.2 24"">                        
        <path d="M.38,24.13h25.2L13,.13Zm13.7-3.8h-2.3v-2.5h2.3Zm0-5.1h-2.3v-5h2.3Z" transform="translate(-0.38 -0.13)" style="fill:#fff"/></svg>
     ${this.unitName}
      </div>
    </foreignObject>`;
  }

  getDataSvg() {
    let selectedFloorId = this.floor.id;
    let svgId = this.svgFloorPlanMap.get(selectedFloorId);

    if(svgId == null) {
      console.error("Error trying to get svgId for selectedFloor id '" + selectedFloorId + "'");
      this.svgFloorPlan.innerHTML = this.getNoDataHtml();
      return ;
    }


    this.assetsService.getSvgAssetAsString(this.propertyId, svgId).subscribe(
      (svgString) => {
      this.svgFloorPlan.innerHTML = svgString;

      this.roomsInfo.forEach((dataRoom) => {
        this.value = dataRoom[this.field];
        this.unitName = dataRoom.name;
        const unitId = dataRoom.id;
        const col = unitId.slice(-2);

        const elemnetId = 'unit_' + col;
        let columnContent: HTMLElement = document.getElementById(elemnetId);
        
        if(columnContent == null){
          console.warn("Could not get column content using element id as '" + elemnetId + "'");
          return ;
        }
        let rect = columnContent.getElementsByTagName('rect')[0];
        if(rect == null) { console.warn("Check your svg. It must contain a rect inside " + 'unit_' + col ); return ;}
        this.rectX = rect.getAttribute('x');
        this.rectY = rect.getAttribute('y');
        this.rectWidth = rect.getAttribute('width');
        this.rectHeight = rect.getAttribute('height');

        switch (this.field) {
          case 'dnd':
            columnContent.innerHTML = this.buildDataHtmlSvg();
            break;
          case 'stateDurationLabel':
            columnContent.innerHTML = this.buildDataHtmlSvg();
            break;
          case 'active-profile-label':
            if (this.value == 'sold') {
              columnContent.innerHTML = this.buildHtmlSold();
            } else if (this.value == 'unsold') {
              columnContent.innerHTML = this.buildHtmlUnsold();
            }
            break;
          case 'presence':
            columnContent.innerHTML = this.buildHtmlPresence();
            break;
          case 'temperatureLabel':
            columnContent.innerHTML = this.buildDataHtmlSvg();
            break;
          case 'setpointLabel':
            columnContent.innerHTML = this.buildDataHtmlSvg();
            break;
          case 'consumptionLastHourLabel':
            columnContent.innerHTML = this.buildDataHtmlSvg();
            break;

          case 'doorSensor': {
            columnContent.innerHTML = this.buildHtmlDoorSensor();
            break;
          }
          case 'switchState': {
            columnContent.innerHTML = this.buildHtmlSwitchState();
            break;
          }
          default:
            console.warn('Not value inside SVG', this.value);
            break;
        }
        if (this.value == undefined || this.value == null || this.value == 'none') {
          columnContent.innerHTML = this.buildHtmlUndefined();
        }
      });
    },(error) => {
      console.error("Error trying to get svg '" + svgId + "' in propertyId '" + this.propertyId + "'. Please check your floorplans configs.");
      this.svgFloorPlan.innerHTML = this.getNoDataHtml();
    })
  }

  getNoDataHtml(){
    return "<h5 style='text-align: center; margin:20px;'>No floor plan data</h5>";
  }

}
