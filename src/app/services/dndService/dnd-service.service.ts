import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TraceType, DataService } from '../data/data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DndService {

  constructor(private dataService: DataService) { }

  getDndLastTraces(propertyId,tag, forceRequest) {
    return this.dataService.getStatesByOwnerAndTagAndTraceType(propertyId, tag, TraceType.DND_MUR, forceRequest).pipe(map((traces: any[]) => {
      traces.forEach(trace => {
        trace['stateDurationLabel'] = this.getStateDurationLabel(trace.stateSince,trace.stateDuration);
      });

      return traces;
    }));
  }

  getDndMap(propertyId,unitTraceMap,dateToAcceptData, buildDataCallBack) {
    this.dataService.getStatesByOwnerAndTagAndTraceType(propertyId, propertyId, TraceType.DND_MUR).subscribe((traces: any[]) => {
      let dndLastTracesMap = this.buildDndMap(traces, unitTraceMap, dateToAcceptData);
      buildDataCallBack(dndLastTracesMap);
    }, (error) => {
      console.error("Error trying to get dnd traces for property: " + propertyId);
      console.error(error);
    });
  }
  private buildDndMap(traces, unitTraceMap, dateToAcceptData) {
    traces.forEach(trace => {
      let id = trace['unitName'];
      if (unitTraceMap[id] == null) {
        //received a trace that is not defined in the structure
        console.warn("Received a trace from unit: " + id + " but its not defined in structure.");
      } else {
        let name = unitTraceMap[id]['name'];
        trace['name'] = name;

        if (trace['timestamp'] < dateToAcceptData) {
          trace['dnd'] = null;
          trace['stateDurationLabel'] = null;
          trace['stateSince'] = null;
        } else {
          //adding property dnd to use in grid
          trace['dnd'] = trace['state'];
          trace['stateDurationLabel'] = this.getStateDurationLabel(trace.stateSince,trace.stateDuration);
        }
        //if is there more than one trace for DND, get just the only one
        if(unitTraceMap[id]['timestamp']){
          if(unitTraceMap[id]['timestamp'] < trace['timestamp']){
            unitTraceMap[id] = trace;
          }
        }else {
          unitTraceMap[id] = trace;
        }
        
      }
    });

    return unitTraceMap;

  }

  getStateDurationLabel(stateSince,stateDuration) {
    if (!stateDuration) {
      return '';
    }

    const start = moment(stateSince);
    const end = moment(stateSince + stateDuration);

    return end.from(start, true);

  }

}
