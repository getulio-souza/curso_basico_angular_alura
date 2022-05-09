import { Injectable } from '@angular/core';


export class RoundValueInfo {
  divideBy: number;
  uom: string;
}

export class RoundResult {
  value: number;
  uom: string;
  label: string;

}

@Injectable({
  providedIn: 'root'
})
export class NumericRoundService {


  constructor() { }


  /**
   * For the given roundValueInfo and number returns a {@link RoundResult}
   * @param roundValueInfo 
   * @param number 
   */
  getRoundResult(roundValueInfo: RoundValueInfo, number: number): RoundResult {

    let ret = new RoundResult();

    ret.value = number / roundValueInfo.divideBy;
    ret.value = this.checkRoundNumber(ret.value);
    ret.uom = roundValueInfo.uom;
    ret.label = ret.value + " " + ret.uom;

    return ret;
  }

  /**
   * For the given number and unit of measure
   * returns the {@link RoundResult}
   * @param number 
   * @param uom 
   */
  getRoundResultByNumber(number: number, uom: string) {
    let ret = new RoundResult();
    const tera = Math.pow(10, 12);
    const giga = Math.pow(10, 9);
    const mega = Math.pow(10, 6);
    const kilo = Math.pow(10, 3);

    //the rule is that we should round
    //to Tera when >= 1000*1000*1000*1000
    //to Giga when >= 1000*1000*1000
    //to Mega when >= 1000*1000
    //to Kilo when >= 1000

    if(number >= tera){
      ret.value = Math.round(number / tera);
      ret.value = this.checkRoundNumber(ret.value);
      ret.uom = "T" + uom;
    } else if(number >= giga){
      ret.value = Math.round(number / giga);
      ret.value = this.checkRoundNumber(ret.value);
      ret.uom = "G" + uom;
    }
    else if (number >= mega) {
      ret.value = Math.round(number / mega);
      ret.value = this.checkRoundNumber(ret.value);
      ret.uom = "M" + uom;
    } else if (number >= kilo) {
      ret.value = Math.round(number / kilo);
      ret.value = this.checkRoundNumber(ret.value);
      ret.uom = "k" + uom;
    } else {
      ret.value = Math.round(number / 1);
      ret.value = this.checkRoundNumber(ret.value);
      ret.uom = uom;
    }

    ret.label = ret.value + " " + ret.uom;

    return ret;
  }

  private checkRoundNumber(number){
    if(number > 1) {
      number = Math.round(number)
    } else {
      number = Math.round(number * 100) / 100;
    }

    return number;
  }

  getRoundValueInfoByNumber(number: number, uomBasic: string){
    return this.getRoundValueInfoByArray([number],uomBasic);
  }
  /**
   * for the given array data and uomBasic (ex: Wh) returns a round value info
   * @param dataArray 
   * @param uomBasic 
   */
  getRoundValueInfoByArray(dataArray: Array<any>, uomBasic: string) : RoundValueInfo {

    let roundValue: RoundValueInfo = {
      divideBy: 1,
      uom: uomBasic
    }

    const tera = Math.pow(10, 12);
    const giga = Math.pow(10, 9);
    const mega = Math.pow(10, 6);
    const kilo = Math.pow(10, 3);

    let biggest = null;

    dataArray.forEach(data => {
      if (biggest == null) {
        biggest = data;
      } else {
        if(data > biggest){
          biggest = data;
        }
      }
    });
    
    if(biggest == null){
      return roundValue;
    }

    if (biggest >= tera) {
      roundValue.divideBy = tera;
      roundValue.uom = "T" + uomBasic;
    } else if (biggest >= giga) {
      roundValue.divideBy = giga;
      roundValue.uom = "G" + uomBasic;
    }else if (biggest >= mega) {
      roundValue.divideBy = mega;
      roundValue.uom = "M" + uomBasic;
    } else if (biggest >= kilo) {
      roundValue.divideBy = kilo;
      roundValue.uom = "k" + uomBasic;
    }

    return roundValue;
  }



}
