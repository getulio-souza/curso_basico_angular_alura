import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { RealTime } from '../../abstracts/realTime';
import { DndService } from '../../services/dndService/dnd-service.service';
@Component({
  selector: 'housekeeping-dnd-grid',
  templateUrl: './dnd-grid.component.html',
  styleUrls: ['./dnd-grid.component.less']
})
export class DndGridComponent implements OnChanges, OnDestroy {

  @Input() unitTraceMap;
  @Input() structure;
  @Input() propertyId;
  @Input() dateToAcceptData;

  makeUpRoomsData = [];
  realTime;


  selectedRoom;

  constructor(private dndService: DndService) {

  }

  ngOnChanges() {

    if (!this.unitTraceMap) {
      return;
    }

    if (this.realTime == null) {
      this.realTime = new RealTime();
      this.makeUpRoomsData = new Array();
      this.realTime.startGettingRealTimeData(() => {
        this.getData();
      });
    }


  }

  ngOnDestroy() {
    if(this.realTime) {this.realTime.clearInterval();}
  }

  getData() {
    this.dndService.getDndMap(this.propertyId, this.unitTraceMap, this.dateToAcceptData, () => {
      this.makeUpRoomsData = this.buildDataAsArray();
    });
  }


  buildDataAsArray() {

    let ret = [];

    for (var property in this.unitTraceMap) {
      if (this.unitTraceMap.hasOwnProperty(property)) {
        ret.push(this.unitTraceMap[property]);
      }
    }
    return ret;
  }
  ngOnInit() {

  }

  selectRoom(room) {
    this.selectedRoom = room;
  }

  isLess5(room) {
    console.log(room);
    if (this.checkNullRoom(room)) { return; }

    if (!room) {
      return;
    }
    return room.stateDuration <= 5 * 60 * 1000 ? true : false;
  }

  isFrom5To10(room) {
    if (this.checkNullRoom(room)) { return; }

    if (room.stateDuration > 5 * 60 * 1000 && room.stateDuration <= 10 * 60 * 1000) {
      return true;
    }
    return false;
  }

  isFrom10To20(room) {
    if (this.checkNullRoom(room)) { return; }

    if (room.stateDuration > 10 * 60 * 1000 && room.stateDuration <= 20 * 60 * 1000) {
      return true;
    }
    return false;
  }

  isMoreThan20(room) {
    if (this.checkNullRoom(room)) { return; }

    if (room.stateDuration > 20 * 60 * 1000) {
      return true;
    }
    return false;
  }

  checkNullRoom(room) {
    if (!room) {
      return true;
    }
    return false;
  }
  getGridColor() {
    return 'orange'
  }

  getBackgroundColor(room) {
    if (room) {
      if (room.dnd == 'do-not-disturb') {
        return "rgb(239, 83, 80)";
      } if (room.dnd == 'none') {
        return 'rgb(169, 169, 169)';
      } else if (room.dnd == 'make-up-room') {
        return this.getGreenColor(room.stateDuration);
      }
    }


    return '#333c49';
  }

  getGreenColor(stateDuration) {
    if (!stateDuration) {
      return 'green';
    }

    if (stateDuration <= 5 * 60 * 1000) {
      return '#00dca9';
    } else if (stateDuration > 5 * 60 * 1000 && stateDuration <= 10 * 60 * 1000) {
      return '#159376';
    } else if (stateDuration > 10 * 60 * 1000 && stateDuration <= 20 * 60 * 1000) {
      return '#226757';
    } else {
      return '#135d4c';
    }
  }
}
