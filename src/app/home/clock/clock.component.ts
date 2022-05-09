import { Component, OnInit, NgZone } from '@angular/core';

import { ClockComponent as BaseClockComponent} from '@alis/customer-base';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'home-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.less']
})
export class ClockComponent extends BaseClockComponent {

  constructor(zone: NgZone, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    super(zone, iconRegistry,sanitizer);
  }


}
