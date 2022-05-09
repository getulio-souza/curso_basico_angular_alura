import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date/date.service';
import { DataService } from '../../services/data/data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'it-connection-widget',
  templateUrl: './connection-widget.component.html',
  styleUrls: ['./connection-widget.component.less']
})
export class ConnectionWidgetComponent implements OnInit {

  lastNetworkUpdated;
  currentTime;
  diffMinutes;

  //1-online
  //2-stale
  //3-offline
  connectionState = 3;

  constructor(private dateService: DateService, translateService: TranslateService) {
  }

  ngOnInit() {

    this.lastNetworkUpdated = this.getLastNetworkUpdated();
    this.calculateDiffMinutes();

    setInterval(() => {
      this.calculateDiffMinutes();
    }, 60*1000);
  }

  calculateDiffMinutes() {
    this.currentTime = this.dateService.getCurrentTime();

    let diffMs = this.currentTime - this.lastNetworkUpdated;
    this.diffMinutes = Math.round(diffMs / 60000);

    if (this.diffMinutes < 20) {
      //20 min
      this.connectionState = 1;
    } else if (this.diffMinutes > 20 && this.diffMinutes < 60) {
      //20-60min
      this.connectionState = 2;
    } else {
      //more than 60 min
      this.connectionState = 3;
    }
  }

  getLastNetworkUpdated() {
    return this.dateService.getMinutesBefore(3);
  }

}
