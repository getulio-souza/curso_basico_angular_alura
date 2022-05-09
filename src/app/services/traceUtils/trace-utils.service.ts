import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ThermostatService } from '../thermostatService/thermostat.service';
import { DndService } from '../dndService/dnd-service.service';
import { TraceType, DataService } from '../data/data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TraceUtilsService {

  constructor(private dataService: DataService, private dndService: DndService, private thermostatService: ThermostatService) { }

  
  /**
   * 
   * Gets last trace for Dnd, Thermostat and EMS
   * 
   * @param owner the ownerId
   * @param tag  the tag
   * @param forceRequest if true, it will request data even having a valid cache 
   */
  getLastDndTkoAndEmsTraces(owner, tag, structure, temperatureUomIsFahrenheit, forceRequest) {
    let dndMostCurrentTrace = this.dndService.getDndLastTraces(owner, tag, forceRequest).pipe(map(res => res));

    let thermostatMostCurrentTrace = this.thermostatService.getLastTracesThermostatData(owner, tag, structure, forceRequest, temperatureUomIsFahrenheit).pipe(map(res => res));

    //using ems to aggregate last hour (norm uses 1h to aggregate)
    let emsMostCurrentTrace = this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.EMS, forceRequest).pipe(map(res => res));

    let presenceSensorTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.PRESENCE_SENSOR).pipe(map(res => res));
    
    let doorSensorTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.DOOR_SENSOR).pipe(map(res => res));
    
    let switchTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.RELAY).pipe(map(res => res));
    
    let levelTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.LEVEL).pipe(map(res => res));
    
    let lockTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.LOCK).pipe(map(res => res));

    let mduunitTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.MDUUnit).pipe(map(res => res));

    let waterConsumptionTrace =  this.dataService.getStatesByOwnerAndTagAndTraceType(owner, tag, TraceType.WATERMETER).pipe(map(res => res));
    
    
    return forkJoin([
      dndMostCurrentTrace,
      thermostatMostCurrentTrace,
      emsMostCurrentTrace,
      presenceSensorTrace,
      doorSensorTrace,
      switchTrace,
      levelTrace,
      lockTrace,
      mduunitTrace,
      waterConsumptionTrace
    ]
      
      ).pipe(map(results => {
      return results;
    }));

  }

  
}
