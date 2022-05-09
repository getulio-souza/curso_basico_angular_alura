import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {share, finalize } from 'rxjs/operators';
@Injectable()
export class ContextService {

    private currentRequests = new Map();
    private emitChangeSource = new Subject<any>();
    public changeEmitted = this.emitChangeSource.asObservable();
    public allowedTabs = [];
    public moreThanOnePropertyOption = false;

    structureFilteredMap = {};
        

    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    clearBuildingUnitFilter() {
        this.structureFilteredMap = {};
    }


    

  /**
   * Gets the request observable after manage 'observable queue'.
   * Use this method to make sure if another equal request arrives
   * it should return the one that have already been sent
   * 
   * @param identifier the request identifier, should be url + body
   * @param request a HttpRequest that must return an observable
   */
  public getRequestObservable(identifier, request: Observable<any>): Observable<any> {

    let currentRequest = this.currentRequests.get(identifier);
    if (currentRequest == null) {
      currentRequest = request.pipe(share());
      this.currentRequests.set(identifier, currentRequest);
    }
    return currentRequest.pipe(
      finalize(() => {
        this.currentRequests.delete(identifier);
      })
    );;
  }

}