import { FakeDataService } from './../../services/fake-data/fake-data.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'home-page-floors-info',
  templateUrl: './floors-info.component.html',
  styleUrls: ['./floors-info.component.less']
})
export class FloorsInfoComponent implements OnInit {
  
  @Input() cardsList;
  @Input() cardLabel;

  totalCards = 0;

  constructor() { }

  ngOnInit() {
    if(this.cardsList.length == 0) {
      console.error("floors list is empty. Please check configs")
    }


  }


}
