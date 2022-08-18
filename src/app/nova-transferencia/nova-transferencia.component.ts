import { Component } from "@angular/core";

@Component({
    selector: 'nova-transferencia',
    templateUrl: './nova-transferencia.component.html',
    styleUrls:['./nova-transferencia.component.scss'],
})
export class NovaTransferenciaComponent{
  // valor: number | undefined ;
  // destino: string | undefined;
  valor: number = 12;
  destino: number = 22;

  // NovaTransferenciaComponent(valor: number, destino: number) {
  //   this.destino = destino
  //   this.valor = valor
  // }

  transferir() {
     console.log('solicitada nova transferência');
     console.log("valor: " , this.valor)
     console.log('valor: ', this.destino)
   }
}
