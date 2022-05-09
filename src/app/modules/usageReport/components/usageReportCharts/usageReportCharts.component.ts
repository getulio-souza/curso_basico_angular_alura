import { EventService, EVENT_TAG } from './../../../../services/event/event.service';
import { DateService } from './../../../../services/date/date.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { AbstractThirtyDays } from '../../../../abstracts/abstractThirtyDays';

@Component({
  selector: 'app-usage-report-charts',
  templateUrl: './usageReportCharts.component.html',
  styleUrls: ['./usageReportCharts.component.scss']
})
export class UsageReportChartsComponent extends AbstractThirtyDays implements OnChanges {


  @Input() structure;
  @Input() propertyId;
  @Input() tag;

  resolution = 'hour'
  startDate;
  endDate;

  //grid
  showEventsGrid = false;
  gridColumns = [];
  eventsGridData;

  @Output() onGridShowEmitter = new EventEmitter<any>();


  constructor(dateService: DateService, private eventService: EventService, private translateService: TranslateService) {
    super(dateService);

    this.startDate = dateService.getStartCurrentDay();
    this.endDate = dateService.getEndOfPassedDay(Date.now());
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

  getData() {
    // Do nothing
    // resolution, start and end chate
    // children are notified
  }

  onGoDeeper(info) {
    this.goDeeper(info);
  }



  onGoDeeperAutomation(info) {

    if (this.resolution != 'hour') {
      //it goes deeper
      this.onGoDeeper(info);
      return;
    }

    let start = info['timestamp'].getTime();
    let end = start + 60 * 60 * 1000;
    let deviceType = info['deviceType'];
    const tag = this.tag != null ? this.tag : this.propertyId;

    this.eventService.getEventsByTag(
      this.propertyId, tag,EVENT_TAG.ON_SET_EVENT,
      deviceType, start, end).subscribe((res) => {
        this.buildAutomationEventsGrid(res);
        this.onGridShowEmitter.emit({showGrid: true});
        this.showEventsGrid = true;
      });
      
  }
  
  onGoDeeperCalls(info) {
    
    if (this.resolution != 'hour') {
      //it goes deeper
      this.onGoDeeper(info);
      return;
    }
    
    let start = info['timestamp'].getTime();
    let end = start + 60 * 60 * 1000;
    let callEventType = info['callEventType'];

    const tag = this.tag != null ? this.tag : this.propertyId;
    this.eventService.getEventsByTag(
      this.propertyId, tag, EVENT_TAG.CALL_EVENT,
      callEventType, start, end).subscribe((res) => {
        this.buildCallEventGrid(res);
        this.onGridShowEmitter.emit({showGrid: true});
        this.showEventsGrid = true;
      });

  }

  buildAutomationEventsGrid(automationEvents: Array<any>) {

    this.eventsGridData = [];
    automationEvents.forEach((automationEvent) => {
      this.eventsGridData.push({
        "deviceType": this.translateService.instant(automationEvent['eventSubtype']),
        "deviceTemplate": automationEvent['subject'],
        "unit": automationEvent['propertyUnit-name'],
        "attributeName": this.translateService.instant(automationEvent['attributeName']) ,
        "value": automationEvent['value'] ,
        "timestamp": automationEvent['timestamp'],
      })
    });

    this.gridColumns = [
      { header: 'Device Type', field: 'deviceType' },
      { header: 'Device Template', field: 'deviceTemplate' },
      { header: 'Unit', field: 'unit' },
      { header: 'Attribute', field: 'attributeName' },
      { header: 'Value', field: 'value' },
      { header: 'Date', field: 'timestamp' },
    ]

  }

  buildCallEventGrid(callEvents: Array<any>) {

    this.eventsGridData = [];
    callEvents.forEach((callEvent) => {
      this.eventsGridData.push({
        "eventType": this.translateService.instant(callEvent['eventType']),
        "source": callEvent['source'],
        "subject": callEvent['subject'],
        "timestamp": callEvent['timestamp'],
      })
    });

    this.gridColumns = [
      { header: 'Event type', field: 'eventType' },
      { header: this.translateService.instant('label-call-from'), field: 'source' },
      { header: this.translateService.instant('label-call-to'), field: 'subject' },
      { header: 'Date', field: 'timestamp' },
    ]

  }


  onGridItemClick(item) {
    console.log("item clicked");
  }

  backToCharts() {
    this.onGridShowEmitter.emit(false);
    this.showEventsGrid = false;
  }

}