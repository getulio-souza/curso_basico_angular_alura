import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-status',
  templateUrl: './header-status.component.html',
  styleUrls: ['./header-status.component.css']
})
export class HeaderStatusComponent implements OnInit {

   constructor(private translateService: TranslateService) {
    // translateService.setDefaultLang('pt');
  }


  ngOnInit() {
  }

  switchLanguage(language: string) {
    this.translateService.use(language);
  }


}
