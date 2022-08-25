import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ChartsObservable extends Subject<boolean> {
  constructor() {
    super();
  }
}
