import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import * as SvgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-property-map',
  templateUrl: './property-map.component.html',
  styleUrls: ['./property-map.component.less']
})
export class PropertyMapComponent implements OnChanges {

  @Input() svgString;
  @Input() selectedFloor;
  @Input() propertyId;
  @Input() propertyMapConfig;
  @Output() onChangeFloorEmitter = new EventEmitter<any>();


  private static SVG_CONTAINER_ID = 'svgContainer';
  private static ZOOM_OUT_CLASS_NAME = 'zoom-out-hide';
  private static MIN_ZOOM_VALUE_TO_HIDE = 1.8;
  private static SELECTED_CLASS_NAME = 'selected';

  private clickFlag;

  zoomLevel;
  htmlSvg;
  panZoomTiger: SvgPanZoom.Instance;
  isReady = false;

  componentsSelected = new Array<HTMLElement>();
  svgElement: SVGSVGElement;
  checkPanLimits = true;

  lastFloorIdClickedMap = null;

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone) {
    this.isReady = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedFloor != null &&
      !changes.selectedFloor.isFirstChange()
    ) {
      //floor has been changed
      if (this.selectedFloor != null) {
        const structure = this.selectedFloor.structure;
        if (structure != null) {
          const floorId = this.propertyId + "." + structure.id;
          const element = this.findFloorOnSvg(floorId);

          if (this.lastFloorIdClickedMap != floorId) {
            // means that changes was done by external component
            // was NOT made by clicking on map 
            // since a clicking map event also emits an event to parent
            // and the change is detected by ngOnChanges
            // so, the last click floor is NOT the received floorId
            // reset
            this.lastFloorIdClickedMap = null;
          }

          if (element != null) {
            let hasSelected = this.componentsSelected.includes(element);
            if(this.componentsSelected == null || hasSelected == false){
              this.applySelectClass(element);
            }
            console.log("applying zoom and pan from ngOnChanges");
            this.applyZoomAndPan(element);
            this.onChangeFloorEmitter.emit(floorId);
          } else {
            // element has not been found.
            // at least lets remove selected elements
            this.applySelectClass(null);
            console.warn("Could not find interaction config for floorId '" + floorId + "'");
          }
        }
      } else {
        //is not the first time and is null, lets check if the previous value is not null
        if (changes.selectedFloor.previousValue != null) {
          //we are coming back to whole property view, lets remake svg
          
          // back from property view means that this were
          // changed by external action
          
          this.addStyleTransition();

          this.panZoomTiger.reset();
          this.applySelectClass(null);
        }
      }
    }

    if (changes.svgString != null && this.svgString) {
      this.buildSvgAndCallBacks();
    }

  }

  /**
   * Gets the view port applying a transition style
   * Then, it removes the transition
   */
  addStyleTransition() {
    const svgsViewport = document.getElementsByClassName("svg-pan-zoom_viewport");
    let svgViewport = null;
    if (svgsViewport.length != 0) {
      svgViewport = svgsViewport[0];
    }

    // lets add transition to enable transition only on click event
    if (svgViewport != null) { svgViewport['style']['transition'] = "transform 0.5s ease"; }

    // lets remove transition to enable transition only on click event
    if (svgViewport != null) {
      setTimeout(() => {
        svgViewport['style']['transition'] = null;
      }, 500)
    }
  }
  findFloorOnSvg(floorId) {

    let element = null;
    const svgIdMap = this.propertyMapConfig.svgIdMap;
    if (this.propertyMapConfig.svgIdMap) {
      // first, lets just invert map key-value to value-key

      for (var key of Object.keys(svgIdMap)) {
        if (svgIdMap[key] == floorId) {
          element = document.getElementById(key)
        }
      }
    }

    if (element == null) {
      // there is no svgIdMap config for this floorId
      // lets try to find floorId direct on svg
      element = document.getElementById(floorId);
    }

    return element;
  }

  buildSvgAndCallBacks() {

    // this.htmlSvg = this.sanitizer.bypassSecurityTrustHtml(this.svgString);
    this.htmlSvg = this.sanitizer.bypassSecurityTrustHtml(this.svgString);

    setTimeout(() => {
      const svgs = document.getElementsByTagName("svg");
      if (svgs.length > 1) {
        console.warn("More than one svg found. Only 1 is expected. Getting the first");
      }


      this.svgElement = document.getElementsByTagName("svg")[0];
      this.svgElement.classList.add(PropertyMapComponent.ZOOM_OUT_CLASS_NAME);

      // getting zoom level from config
      this.zoomLevel = this.propertyMapConfig.zoomLevel;
      if(this.zoomLevel == null){
        //if there is no config uses default
        this.zoomLevel = PropertyMapComponent.MIN_ZOOM_VALUE_TO_HIDE;
      }

      this.panZoomTiger = SvgPanZoom(this.svgElement,
        {
          controlIconsEnabled: false,
          minZoom: 1,
          maxZoom: 10,
          fit: true,
          beforeZoom: (oldScale, newScale) => {
            if (newScale >= this.zoomLevel) {
              this.svgElement.classList.remove(PropertyMapComponent.ZOOM_OUT_CLASS_NAME);
            } else {
              //too far, lets hide some items
              this.svgElement.classList.add(PropertyMapComponent.ZOOM_OUT_CLASS_NAME);
            }
          },
          beforePan: (oldPan, newPan) => this.beforePan(oldPan, newPan)
        });

      this.prepareCallBack();
    }, 250);
  }

  findConfig(floorId) {
    if (this.propertyMapConfig.interactions == null) { return null; }

    for (let i = 0; i < this.propertyMapConfig.interactions.length; i++) {
      const config = this.propertyMapConfig.interactions[i];
      if (config.floorId == floorId) {
        return config;
      }
    }
    return null;
  }

  prepareCallBack() {
    if (this.propertyMapConfig.interactions != null) {
      this.propertyMapConfig.interactions.forEach(config => {
        config.handleClickOn.forEach(id => {
          this.addListeners(document.getElementById(id), config, id);

        });
      });
    } else {
      console.warn("No interaction config was found for svg map.");
    }

    this.isReady = true;
  }

  addListeners(container, config, id) {
    if (container != null) {

      container.addEventListener("mousedown", this.onMouseDown(), false);
      container.addEventListener("touchstart", this.onMouseDown(), false);

      container.addEventListener("mousemove", this.onMouseMove(), false);
      
      container.addEventListener("mouseup", (event) => { this.onMouseUp(container,config);}, false);
      container.addEventListener("touchend", (event) => { this.onMouseUp(container,config);}, false);

    } else {
      console.warn("The following config could not find the given element id '" + id + "'");
    }

  }

  onMouseDown() {
    this.clickFlag = 0;
  }

  onMouseMove() {
    // this.clickFlag = 1;
  }

  onMouseUp(container,config){
    if (this.clickFlag === 0) {
      // on click

      //only apply 'select' if it is not selected yet
      let hasSelected = this.componentsSelected.includes(container);
      if(this.componentsSelected == null || hasSelected == false){
        this.applySelectClass(container);
      }

      this.applyZoomAndPan(container);
      this.lastFloorIdClickedMap = config.floorId;
      this.onChangeFloorEmitter.emit(config.floorId);
    } else if (this.clickFlag === 1) {
      //on drag
    }
  }

  applySelectClass(target) {

    //first lets remove from all previous selected elements
    this.componentsSelected.forEach(element => {
      element.classList.remove('selected');
    });

    this.componentsSelected = [];

    if (target != null) {

      this.ngZone.runOutsideAngular(() => {
        target.classList.add(PropertyMapComponent.SELECTED_CLASS_NAME);
      })
      this.componentsSelected.push(target);
    }
  }


  applyZoomAndPan(target) {


    this.checkPanLimits = false;

    this.svgElement.classList.remove(PropertyMapComponent.ZOOM_OUT_CLASS_NAME);

    // first lets center to calculate from center point
    // actually, we are doing a panBy from center
    this.panZoomTiger.center();

    //lets get worldBBox center positions
    const worldBBox = this.panZoomTiger.getSizes().viewBox;
    const worldCenterX = worldBBox['x'] + worldBBox.width / 2;
    const worldCenterY = worldBBox['y'] + worldBBox.height / 2;

    // lets find target object clicked
    // and get center position (X,Y)
    const targetBBox = target.getBBox();
    const targetX = targetBBox.x + targetBBox.width / 2;
    const targetY = targetBBox.y + targetBBox.height / 2;

    this.panZoomTiger.zoom(this.zoomLevel + 0.05);

    // getting zoomFactor and calculatin panByX and panByY
    const zoomFactor = this.panZoomTiger.getSizes().realZoom;
    const panByX = zoomFactor * (worldCenterX - targetX);
    const panByY = zoomFactor * (worldCenterY - targetY);

    
    this.panZoomTiger.panBy({ x: panByX, y: panByY });
    this.checkPanLimits = true;

    this.addStyleTransition();

  }

  beforePan(oldPan, newPan) {

    if(!this.checkPanLimits) {
      return true;
    }
    
    const sizes = this.panZoomTiger.getSizes();

    const rightLeftEdge = sizes.width * 0.9;
    const topBottomEdge = sizes.height * 0.9;;

    const leftLimit = -((sizes.viewBox['x'] + sizes.viewBox.width) * sizes.realZoom) + rightLeftEdge;
    const rightLimit = sizes.width - rightLeftEdge - (sizes.viewBox['x'] * sizes.realZoom);
    const topLimit = -((sizes.viewBox['y'] + sizes.viewBox.height) * sizes.realZoom) + topBottomEdge;
    const bottomLimit = sizes.height - topBottomEdge - (sizes.viewBox['y'] * sizes.realZoom);

    let customPan = {}
    customPan['x'] = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
    customPan['y'] = Math.max(topLimit, Math.min(bottomLimit, newPan.y))

    let x = newPan.x;
    let y = newPan.y;

    if(customPan['x'] == rightLimit || customPan['x'] == leftLimit){
      // reached x limit
      x = oldPan.x;;
    }

    if(customPan['y'] == topLimit || customPan['y'] == bottomLimit) {
      // reached y limit
      y = oldPan.y;;
    }

    let ret = {
      x: x,
      y: y
    }; 

    return ret;
  }


  findChild(childId): HTMLElement {
    let element = document.getElementById(PropertyMapComponent.SVG_CONTAINER_ID);
    if (element != null) {
      return element.querySelector(`[id=${childId}]`);
    }
    return null;
  }


}