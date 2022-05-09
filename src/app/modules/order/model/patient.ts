/* import { CivilId } from './id/civilId';
import { TaxpayerId } from './id/taxpayerId';
 */
export class Patient {
  currentEncounterRoom?: string;
  id;
  lastUpdate;
  name: string;
  motherName: string;
  birthDate;
  age?;
  ageInMonths?;
  gender;
  hisid: string;
  civilId/* : CivilId */ = { emissionDate: null, emissionPlace: null, emitter: null, id: null };
  taxpayerId/* : TaxpayerId */ = { id: null, name: null };
  photo;
  email;
  phone;
}