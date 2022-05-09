import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PropertySummaryState {

  private emitChangeSource = new Subject<any>();
  public isLoadingSummaries$ = this.emitChangeSource.asObservable();

  emitIsLoadingSummaries(change: boolean) {
      this.emitChangeSource.next(change);
  }


}