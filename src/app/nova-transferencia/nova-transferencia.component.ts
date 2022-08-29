import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'nova-transferencia',
    templateUrl: './nova-transferencia.component.html',
    styleUrls:['./nova-transferencia.component.scss'],
})
export class NovaTransferenciaComponent{

@Output() aoTransferir = new EventEmitter<any>();

  valor: number = 12;
  destino: number = 22;

  transferir() {
     console.log('solicitada nova transferência');
      const valorEmitir = {valor: this.valor, destino: this.destino};
      this.aoTransferir.emit(valorEmitir);
   }
}
