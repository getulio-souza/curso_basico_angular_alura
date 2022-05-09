import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';


@Component({
  selector: 'rooms-grid',
  templateUrl: './rooms-grid.component.html',
  styleUrls: ['./rooms-grid.component.scss']
})
export class RoomsGridComponent implements OnInit, OnChanges {


  @Input() roomsInfo;
  @Input() selectedFloor;
  @Input() selectedRoom;
  @Output() selectedRoomChange = new EventEmitter<string>();

  constructor() {
  
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes) {
    let selectedRoom = changes.selectedRoom;
    if(selectedRoom) {
      let value = selectedRoom.currentValue
      if(value) {
        let element = document.getElementById(value.id);
        if (element != null) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  getRooms() {
  }

  onRoomClick(room) {
    this.selectedRoom = room;
    this.selectedRoomChange.emit(this.selectedRoom);
  }

  isRoomWithPresence(room) {
    return room.presence == 'true';
  }

   
  isRoomSold(room) {
    return room.sold == 'sold';
  }




}
