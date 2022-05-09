import { Injectable } from '@angular/core';
import * as Convert from 'convert-units';

@Injectable({
  providedIn: 'root'
})
export class ManometerService {
  
  convert = Convert;

  /**
   * 
   * @param pressureInPascal the pressure in Pascal
   * @param pressureUomIsPsi if true, will convert to PSI
   */
  buildPressureLabels(pressureInPascal, pressureUomIsPsi) {

    if (pressureInPascal == null || isNaN(pressureInPascal)) {
      return '--';
    }

    let label;
    let pressure = Math.round(pressureInPascal);
    if (pressureUomIsPsi) {
      pressure = Math.round(this.convert(pressureInPascal).from('Pa').to('psi'));
      label = pressure + ' Psi';
    } else {
      label = pressure + ' Pa';
    }

    return label;
  }


  /**
   * 
   * @param pressureInPascal the pressure in Pa
   * @param pressureUomIsPsi if true, will convert to Psi 
   */
  buildPressure(pressureInPascal, pressureUomIsPsi) {

    if (pressureInPascal == null || isNaN(pressureInPascal)) {
      return null;
    }

    let pressure = pressureInPascal;
    if (!pressureUomIsPsi) {
      console.log("pressure", pressure);
      pressure = Math.round(this.convert(pressureInPascal).from('Pa').to('psi'));
    }
    return pressure;
  }


}
