import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'byte-bank';
  destino!: number;
  valor!: number;

  //isso é um método
  transferir($event: any){
  console.log($event);
  this.destino = $event.destino;
  this.valor = $event.valor;

  //após emitir os valor, vamos limapr os campos preenchidos
  this.limparCampos();
}
//isso também é um método
limparCampos(){
this.valor = 0;
this.destino = 0;
}

}

