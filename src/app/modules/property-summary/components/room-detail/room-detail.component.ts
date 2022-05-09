import { DataService, TraceType } from './../../../../services/data/data.service';
import { DateService } from './../../../../services/date/date.service';
import { StructureService } from '@alis/tracking-ng';
import { map } from 'rxjs/operators';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import * as timeLinePlus from 'timeline-plus';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '@alis/customer-base';
import { Router } from '@angular/router';
import { ContextService } from '../../../../services/context/context.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit, OnChanges {

  @Input() structure;
  @Input() properties;
  @Input() propertyId;
  @Input() room;
  @Input() hideGridColumns: Array<any>;
  
  @Output() backToGridEmmiter = new EventEmitter<any>();
  @Output() onChangeStructureFilterEmitter = new EventEmitter<any>();
  
  tag;
  timelineIsReady = false;

  gridColumnsToBeShown = [];

  cols = [

    { field: 'name', header: 'Name' },
    { field: 'active-profile-label', header: 'Sold' },
    { field: 'presence', header: 'Occupied' },
    { field: 'setpointLabel', header: 'Setpoint' },
    { field: 'temperatureLabel', header: 'Temperature' },
    { field: 'consumptionLastHourLabel', header: 'kWh' },
    { field: 'timestamp', header: 'Last Updated' }

  ];


  // field is the field from `property_unit`
  // columnField is the field from grid
  timelineAttributes = [
    {field: "presence", columnField: 'presence', label: "Presence", valueToBeCompared: "true", group: 0, classId: 'occupancy-sensor'},
    {field: "pmsState", columnField: 'active-profile-label', label: "Sold", valueToBeCompared: "sold", group: 1, classId: "sold"},
    {field: "relayLevel", columnField: 'relayLevel', label: "Relay and Level", valueToBeCompared: "on", group: 2, classId: "relay-level-state"},
    {field: "lockState", columnField: 'lockState', label: "Lock", valueToBeCompared: "locked", group: 3, classId: "lock-state"},
    {field: "doorSensorState", columnField: 'doorSensor', label: "Door sensor", valueToBeCompared: "opened", group: 4, classId: "sensor-door"},
    {field: "masterOff", columnField: 'switchState', label: "Master off", valueToBeCompared: "true", group: 5, classId: "master-switch"}
  ]


  groups: timeLinePlus.DataSet;
  items: timeLinePlus.DataSet;
  options;

  //start of current day
  start;
  startChart;
  end;

  container:  HTMLElement;
  timeline;

  validAttrs = new Set<string>();
  
  unitStructureSelected;

  contextService;
  constructor(private dateService: DateService, private dataService: DataService, private structureService: StructureService,
              private translateService: TranslateService,
              private route: Router,
              contextService: ContextService) {

    this.contextService = contextService;

    this.start = this.dateService.getStartOfDay(this.dateService.getXDaysBeforeFromNow(2)) ;
    this.startChart =this.dateService.getStartOfDay(Date.now());
    this.end = this.dateService.getEndOfPassedDay(Date.now());

    this.translateService.onLangChange.subscribe((event) => {
      this.buildGroups();
      this.timeline.setData({groups: this.groups, items: this.items});
    });


  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.room){
      //lets only change if room has been changed
      if(this.container != null){
        this.container.style.display = "none";
      }
      this.timelineIsReady = false;
      this.tag = this.room['id'];  
      this.unitStructureSelected = this.structureService.getStructureByGivenStructureId(this.structure,this.room['id']); 
      this.buildTimeLine();
    }
  }

  buildOptions() {
    this.options = {
      // one day in milliseconds
      zoomMin: 1000 * 60 * 60 * 24,
      zoomMax: 1000 * 60 * 60 * 24,
      groupOrder: 'group',  // groupOrder can be a property name or a sorting function
      // showMajorLabels: false,
      timeAxis: {
        scale: 'hour',
        step: 1
      },
      autoResize: true,
      showMinorLabels: true,
      orientation: {
        axis: 'bottom'
      },
      onInitialDrawComplete: (item,callback) => {
        this.timelineIsReady = true;
      },
      end: this.end,
      start: this.startChart,
      stack: false,
      template: function (items) {
        if (items.class == 'dadasda') {
          return `<div class="${items.class}">'dadasd'</div>`;
        }
      },
      // moveable: false
      // zoomable: false
    };
  }
  buildGroups() {
    this.groups = new timeLinePlus.DataSet();
   
    // lets check which attrs have at least one item (trace) in a response
    // in case there is no response for the given trace type,
    // lets not add its group
    console.info("received the following trace types: ", this.validAttrs);
           
    this.timelineAttributes.forEach(element => {
      let shouldShow = this.findColumnHeaderByField(element.columnField) != null ? true : false;
     
      if(shouldShow){
        this.addGroup(element.field, element.label, element.group, element.classId);
      }
      
    });  
  }

  addGroup(attributeName, attributeLabel, groupId, className) {
    if(this.validAttrs.has(attributeName)){
      let translatedHeader = this.translateService.instant(attributeLabel);
      this.groups.add({ id: groupId, content: translatedHeader, className: className });    
    }
  }

  findColumnHeaderByField(field: string){

    for( let i = 0; i< this.gridColumnsToBeShown.length; i++){
      let col = this.gridColumnsToBeShown[i];
      const colField = col.field;
      if(colField == field){
        return col.header;
      }
    }

    return null;
  }

  buildItemsByField(traces, attr, valueToBeCompared, group){
    let items = [];
    const firstTrace = traces[0];
    let firstTimestamp = firstTrace['timestamp'];
    let lastTimestamp = firstTimestamp;
    let lastRelayValue = firstTrace[attr] == valueToBeCompared;



    let value;
    for (let i = 1; i < traces.length; i++) {
      const trace = traces[i];
      let timestamp = trace['timestamp'];
      value = trace[attr] == valueToBeCompared;

      if (lastRelayValue == value) {
        //if is the same, just update timestamp
        lastTimestamp = timestamp;
      } else {
        //else,attr has changed, lets 'close' last event

        if (lastRelayValue) {
          //only add to chart if the 'closed event' was true
          items.push({
            id: i + '-' + attr,
            content: 'item ' + i,
            group: group,
            type: 'range',
            start: new Date(firstTimestamp), end: new Date(timestamp)
          });
        }
        firstTimestamp = timestamp;
      }


      lastRelayValue = value;

    }

    // last one,
    // if true, should add to chart
    // since first 'true' known value
    // untill last 'true' received
    if (value) {
      items.push({
        id: traces.length + 1 + attr,
        content: 'item ' + (traces.length + 1),
        group: group,
        type: 'range',
        start: new Date(firstTimestamp), end: new Date()
      });
    }

    return items;
  }
  
  getData(){


    return this.dataService.getTracesByOwnerAndTag(
      this.propertyId, this.tag, TraceType.UNIT, this.start, null).pipe(map((traces) => {
        if (traces == null || traces.length == 0) { return; }

        let ret = {};
        traces = traces.reverse();
        this.timelineAttributes.forEach(attr => {
          let items = this.buildItemsByField(traces,attr.field, attr.valueToBeCompared, attr.group);
          ret[attr.field] = items;
        });

        return ret;

      }));
  
  }

  buildItems() {

    let allItems = [];  
    this.validAttrs.clear();

    return this.getData().pipe(map((itemsObj)=> {
      // itemsObj is something like
      // {'presence': [...]}
      for (var attr in itemsObj) {
        if (Object.prototype.hasOwnProperty.call(itemsObj, attr)) {
          if(itemsObj[attr] != null && itemsObj[attr].length != 0){
            this.validAttrs.add(attr);
            allItems.push(...itemsObj[attr]);
          }
        }
      }
      return allItems;
    }));

  }

  buildTimeLine() {
    this.buildOptions();
    
    this.buildItems().subscribe((items) => {

      this.items = items;
      
      this.container = document.getElementById('time-line-plus');
      this.buildGroups();
      // if first time lets create a Timeline
      if(this.timeline == null){
        this.timeline = new timeLinePlus.Timeline(this.container, this.items, this.options);
        this.buildOptions();
        this.timeline.setOptions(this.options);
        this.timeline.on("rangechanged", (event) => {
          let start = event.start;
          if( (start.getTime()- this.start) < 12*60*60*1000){
            //day has changed
            this.updateStartDate(start.getTime());
            this.buildTimeLine();
          }
        });

      }

      this.timelineIsReady = true;
      this.container.style.display = "";

      this.timeline.setData({groups: this.groups, items: this.items});

    });



  }

  
  updateStartDate(timestamp){
    this.start = this.dateService.getStartOfDay(this.dateService.getXDaysBefore(timestamp,2)) ;
    this.startChart = timestamp;
  }

  ngOnInit() {
    let propertySummaryConfig = this.properties.propertySummary;
    if (propertySummaryConfig != null) {
      let gridColumns;
      let customColumnsConfig = propertySummaryConfig.customColumns;
      if (customColumnsConfig) {
        gridColumns = customColumnsConfig;
      } else {
        gridColumns = this.cols;
      }

      // we dont want to show room name
      // cause its being already being show above
      this.hideGridColumns.push("name");
      this.gridColumnsToBeShown = [];
      gridColumns.forEach(col => {
        let field = col.field;
        if(!this.hideGridColumns.includes(field)){
          this.gridColumnsToBeShown.push(col);
        }
      });

    }

  }


  buildGenericItems(owner, tag, valueToBeCompared, attr, traceType, group) {
    let items = [];

    return this.dataService.getTracesByOwnerAndTag(owner, tag, traceType, this.start, null)
      .pipe(map((traces: Array<any>) => {
        traces = traces.reverse();

        if (traces == null || traces.length == 0) { return; }

        const firstTrace = traces[0];
        let firstTimestamp = firstTrace['timestamp'];
        let lastTimestamp = firstTimestamp;
        let lastRelayValue = firstTrace[attr] == valueToBeCompared;

        let value;
        for (let i = 1; i < traces.length; i++) {
          const trace = traces[i];
          let timestamp = trace['timestamp'];
          value = trace[attr] == valueToBeCompared;

          if (lastRelayValue == value) {
            //if is the same, just update timestamp
            lastTimestamp = timestamp;
          } else {
            //else,attr has changed, lets 'close' last event

            if (lastRelayValue) {
              //only add to chart if the 'closed event' was true
              items.push({
                id: i + '-' + traceType,
                content: 'item ' + i,
                group: group,
                type: 'range',
                start: new Date(firstTimestamp), end: new Date(lastTimestamp)
              });
            }
            firstTimestamp = timestamp;
          }


          lastRelayValue = value;

        }

        // last one,
        // if true, should add to chart
        if (value) {
          items.push({
            id: traces.length + 1 + traceType,
            content: 'item ' + traces.length + 1,
            group: group,
            type: 'range',
            start: new Date(firstTimestamp), end: new Date(lastTimestamp)
          });
        }

        return items;

      }));
  }

  backToGrid(){
    //adding back 'name'
    var index = this.hideGridColumns.indexOf('name');
    if (index > -1) {
      this.hideGridColumns.splice(index, 1);
    }
    this.backToGridEmmiter.emit();
  }

  onChangeStructureFilter(structureFiltered){
    // this.tag = structureFiltered.id;
    // this.buildTimeLine();
    this.onChangeStructureFilterEmitter.emit(structureFiltered);
  }

  onClickControlRoom(event) {

    const route = "/propertyApp/" + this.propertyId + "/roomControl";
    this.route.navigate([route,{roomId: this.room.id, floorId: this.structure.id }]);
  
  }

}
