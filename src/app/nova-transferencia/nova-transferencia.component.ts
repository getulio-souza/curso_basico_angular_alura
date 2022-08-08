import { Component } from "@angular/core";

@Component({
    selector: 'nova-transferencia',
    templateUrl: './nova-transferencia.component.html',
    styleUrls:['./nova-transferencia.component.scss'],
})
export class NovaTransferenciaComponent{
  transferir() {
     console.log('solicitada nova transferência');
   }
}
