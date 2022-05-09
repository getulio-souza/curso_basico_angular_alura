import { AlertData, AlertService } from './../../../../services/alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';


import { Component, EventEmitter, OnInit, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'app-alert-carousel',
  templateUrl: './alert-carousel.component.html',
  styleUrls: ['./alert-carousel.component.scss']
})
export class AlertCarousel implements OnChanges {


  @Input() alerts;
  @Input() selectedAlert;
  @Input() alertConfigMap;


  // owl carousel
  config: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsEach: true,
    URLhashListener:true,
    navSpeed: 700,
    items: 1,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    }
  };


  constructor(
    private router: Router, private activedRoute: ActivatedRoute, private alertService: AlertService) {

  }

  ngOnChanges(changes){
    if(changes.selectedAlert && this.selectedAlert != null){
      let deviceId = this.selectedAlert.deviceId;
      if(deviceId != null){
        this.router.navigate( ["./"], {
          relativeTo: this.activedRoute, 
          fragment: deviceId
        } )
      }
    }
  }





}
