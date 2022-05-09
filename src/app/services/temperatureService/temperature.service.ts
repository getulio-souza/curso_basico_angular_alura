import { Injectable } from '@angular/core';
import * as Convert from 'convert-units';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {

  convert = Convert;
  
  constructor() {

    
  }

  /**
   * 
   * @param temperatureInCelsius the temperature in Celsius
   * @param temperatureUomIsFahrenheit if true, will convert and concat with ºF / ºC
   */
  buildTempLabels(temperatureInCelsius, temperatureUomIsFahrenheit){
    
    if(temperatureInCelsius == null || isNaN(temperatureInCelsius)){
      return '--';
    }

    let label;
    let temperature = Math.round(temperatureInCelsius);

    if(temperatureUomIsFahrenheit){
      temperature = Math.round(this.convert(temperature).from('C').to('F'));
      label = temperature + ' ºF';
    } else {
      label = temperature + ' ºC';
    }

    return label;
  }

  
  /**
   * 
   * @param temperatureInCelsius the temperature in Celsius
   * @param temperatureUomIsFahrenheit if true,  will convert to Fahrenheit
   */
  buildTemp(temperatureInCelsius, temperatureUomIsFahrenheit){
    
    
    if(temperatureInCelsius == null || isNaN(temperatureInCelsius)){
      return null;
    }
    
    let temperature = temperatureInCelsius;

    if(temperatureUomIsFahrenheit){
      temperature = Math.round(this.convert(temperature).from('C').to('F'));
    }
    return temperature;
  }


}
