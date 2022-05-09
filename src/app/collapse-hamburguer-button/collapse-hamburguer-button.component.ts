import { ContextService } from '../services/context/context.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-collapse-hamburguer-button',
  templateUrl: './collapse-hamburguer-button.component.html',
  styleUrls: ['./collapse-hamburguer-button.component.less']
})
export class CollapseHamburguerButtonComponent implements OnInit {

  @Output() onCollapseButtonEmitter = new EventEmitter<Object>();

  constructor(private contextService: ContextService) { }

  ngOnInit() {
  }


  public onCollapseButtonClick() {
    this.contextService.emitChange('Data from child');
  }

}
