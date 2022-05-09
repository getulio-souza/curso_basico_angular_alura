import { Injectable } from '@angular/core';
import { TraceType, DataService } from '../data/data.service';
import { StructureService } from '@alis/tracking-ng';
import { switchAll, map } from 'rxjs/operators';
import { TemperatureService } from '../temperatureService/temperature.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThermostatService extends TemperatureService {

  constructor(
    private dataService: DataService,
    private structureService: StructureService,
    private temperatureService: TemperatureService) {
    super();
  }

  getLastTracesThermostatData(propertyId, tag, structure, dateToAcceptData, temperatureUomIsFahrenheit) {

    let thermostatsTraces = this.dataService.getStatesByOwnerAndTagAndTraceType(propertyId, tag, TraceType.TKO_THERMOSTAT);
    let tkoThermostatsTraces = this.dataService.getStatesByOwnerAndTagAndTraceType(propertyId, tag, TraceType.THERMOSTAT);

    return forkJoin([thermostatsTraces,tkoThermostatsTraces]).pipe(map((res:Array<Array<any>>) => {
      let thermostatLastTracesResponse = res[0].concat(res[1]);
      let thermostatLastTraces = [];
      
      if (!thermostatLastTracesResponse || thermostatLastTracesResponse.length === 0) {
        // no data to show
        return thermostatLastTraces;
      }

      
      let ids: Set<any> = this.structureService.getAllStructIdsByGivenStructureAndLevel(structure, 0);
      thermostatLastTracesResponse.forEach(lastTraceResponse => {
        // TODO: trackingService should understand full unitId (i.e., trackingService should handle finding it in the structure)
        const roomId = lastTraceResponse.unitName.split('.')[1];
        const roomInfo = this.structureService.getStructureByGivenStructureId(structure, roomId);

        lastTraceResponse['name'] = (roomInfo && roomInfo.name) ? roomInfo.name : roomId;
        if (lastTraceResponse['timestamp'] > dateToAcceptData) {
          
          let setpoint = (Number(lastTraceResponse['cool-setpoint']) + Number(lastTraceResponse['heat-setpoint'])) / 2;
          setpoint = Math.round(setpoint * 10) / 10 ;
          let temperature = lastTraceResponse.temperature;
          temperature = Math.round(temperature * 10) / 10;
          
          lastTraceResponse['temperature'] = temperature;
          lastTraceResponse['setpoint'] = setpoint;
          let tempF = this.buildTemp(temperature, true);
          lastTraceResponse['temperatureF'] = Math.round(tempF);
          let setpointF = this.buildTemp(setpoint, true);
          lastTraceResponse['setpointF'] = Math.round(setpointF);


          lastTraceResponse['temperatureLabel'] = this.buildTempLabels(temperature,temperatureUomIsFahrenheit);
          lastTraceResponse['setpointLabel'] = this.buildTempLabels(setpoint,temperatureUomIsFahrenheit);

          // sold
          lastTraceResponse['active-profile-label'] = null;
          if(lastTraceResponse['active-profile'] === 1){
            lastTraceResponse['active-profile-label'] = 'sold';
          } else if (lastTraceResponse['active-profile'] === 2) {
            lastTraceResponse['active-profile-label'] = 'unsold';
          }
          
        } else {
          lastTraceResponse['temperature'] = null;
          lastTraceResponse['setpoint'] = null;
          lastTraceResponse['active-profile-label'] = null;
          lastTraceResponse['presence'] = null;
        }

        thermostatLastTraces.push(lastTraceResponse);
        ids.delete(roomId);
      });

      return thermostatLastTraces;
    }, switchAll()));
  }

}
