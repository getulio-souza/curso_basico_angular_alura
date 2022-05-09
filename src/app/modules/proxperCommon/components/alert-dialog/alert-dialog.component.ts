import { AlertData, AlertService } from './../../../../services/alert/alert.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialog implements OnChanges, OnInit {


  @Input() alertConfigMap;
  @Input() alert;

  constructor(private alertService: AlertService) {

  }

  ngOnInit() {
    console.log(this.alertConfigMap);
  }

  ngOnChanges(changes) {

  }

  getAlertColor() {
    let color;
    if (this.alertConfigMap != null) {
      color = this.alertConfigMap[this.alert.severity];
    }

    if (color == null) {
      color = this.alertService.getDefaultColor(this.alert.severity);
    }
    return color;
  }
}
