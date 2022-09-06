import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'byte-bank';
  destino!: number;
  valor!: number;
  transferencias: any[] = [];

  //isso é um método
  transferir($event: any) {
    const transferencia = {...$event, data: new Date()}
    console.log($event);
    this.transferencias.push(transferencia);
  }
}
