import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-modal-control',
  templateUrl: './modal-control.component.html',
  styleUrls: ['./modal-control.component.scss']
})
export class ModalControl implements OnInit {


  @Input() propertyId;
  @Input() selectedDevice;
  @Input() selectedItem;
  @Input() device;
  @Input() temperatureUomIsFahrenheit
  @Input() pressureUomIsPsi

  constructor() {
  
  }

  ngOnInit() {
    
  }



}
