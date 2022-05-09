import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-new-devices-demo',
  templateUrl: './new-devices-demo.component.html',
  styleUrls: ['./new-devices-demo.component.css']
})
export class NewDevicesDemoComponent implements OnInit {

  devicesInfo: Array<Object>;
  devices = [];
  
  constructor() {
    this.devicesInfo = environment.realTimeDevices.otherDevices;
    console.log(typeof this.devicesInfo);
  }

  ngOnInit() {
    console.log(this.devicesInfo);
    this.getValues();
  }


  getValues() {
    for(var i=0;i < this.devicesInfo.length; i++){
      let deviceInfo = this.devicesInfo[i];
      console.log(deviceInfo);
      let id = deviceInfo['id'];
      var values = deviceInfo['values'];
      let url = id + "?" + values;
      console.log(url);
    }
  }

}
