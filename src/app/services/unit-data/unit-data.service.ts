import { Injectable } from '@angular/core';
import { ThermostatService } from '../thermostatService/thermostat.service';
import { DndService } from '../dndService/dnd-service.service';
import { StructureService, Structure } from '@alis/tracking-ng';

export interface UnitData {
  roomsInfoMap: Object;
  roomsInfo: Array<any>

}

@Injectable()
export class UnitDataService {

  constructor(private thermostatService: ThermostatService, private dndService: DndService, private structureService: StructureService) { }

  /**
   * builds roomsInfoMap and rooms array (roomsInfo) based on the given floorSummary
   * @param propertyId the propertyId
   * @param floorSummary the floorSummary you want to build rooms info
   */
  buildRoomsInfos(propertyId: string, roomIds: Array<string>, structure: Structure): UnitData {

    let roomsInfo = [];
    let roomsInfoMap = {};

    //a loop to build roomsInfoMap
    if(roomIds != null){
      roomIds.forEach(roomId => {
        const roomInfo = this.structureService.getStructureByGivenStructureId(structure, roomId);
        if (!roomInfo['name']) {
          roomInfo['name'] = roomId;
        }
        roomsInfo.push(roomInfo);
        roomsInfoMap[propertyId + '.' + roomId] = roomInfo;
      });
    }
    

    return {
      roomsInfoMap: roomsInfoMap,
      roomsInfo: roomsInfo
    }
  }

  updateRoomData(roomInfo, unitTrace, temperatureUomIsFahrenheit: boolean) {

    //timestamp
    roomInfo['timestamp'] = unitTrace['timestamp'];

    if (Date.now() - unitTrace['timestamp'] > 60 * 60 * 1000) {
      // in case last timestamp is more than 1 hour,
      // lets not add data to this room.
      return roomInfo;
    }

    // tko_thermostat
    roomInfo['temperatureLabel'] = this.thermostatService.buildTempLabels(
      Math.round(unitTrace['temperature']),
      temperatureUomIsFahrenheit);

    roomInfo['setpointLabel'] = this.thermostatService.buildTempLabels(
      Math.round(unitTrace['setpoint']),
      temperatureUomIsFahrenheit);

    roomInfo['active-profile-label'] = unitTrace['pmsState'];


    roomInfo['presence'] = unitTrace['presence'] != null ? unitTrace['presence'].toString() : null;

    //lock state
    roomInfo['lockState'] = unitTrace['lockState'];

    //door sensor
    roomInfo['doorSensor'] = unitTrace['doorSensorState'];

    //dnd
    roomInfo['dnd'] = unitTrace['dndState'];
    roomInfo['stateDurationLabel'] = this.dndService.getStateDurationLabel(
      unitTrace['dndStateSince'],
      unitTrace['dndStateDuration']
    );

    //mdu
    roomInfo['packageCount'] = unitTrace['packagesCount'];
    roomInfo['reservationCount'] = unitTrace['visitorsCount'];
    roomInfo['serviceRequestCount'] = unitTrace['serviceRequestsCount'];
    roomInfo['visitorsCount'] = unitTrace['reservationsCount'];


    //from relays and levels
    roomInfo['relayLevel'] = unitTrace['relayLevel'];
    roomInfo['switchState'] = unitTrace['masterOff'];


    return roomInfo;
  }




}
