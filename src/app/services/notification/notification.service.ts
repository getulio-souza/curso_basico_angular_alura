import { Injectable, NgZone } from '@angular/core';
import { PropertiesService, AbstractWebSocketService } from '@alis/ng-services';
import { of } from 'rxjs';


export interface NotificationListener {
  /**
   * Called whenever a new event arrives
   */
  onMessage(message: MessageEvent);
}

export enum PropertyState {
  STALE = "PropertyStale",
  OFFLINE = "PropertyOffline",
  
  // online is not a known value for server-side
  // it is just to notification-messages manage messages
  ONLINE = "PropertyOnline",
  
  STALE_BACK_ONLINE = "PropertyStaleBackOnline",
  OFFLINE_BACK_ONLINE = "PropertyBackOnline"

}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends AbstractWebSocketService {


  private static apiPathProperty = 'notificationsUrl';
  private static readonly APP_NAME = "deltix";

  private notificationTo;
  propertyId;

  listeners: NotificationListener[] = [];
  websocket;

  constructor(propertiesService: PropertiesService) {
    super(NotificationService.apiPathProperty, propertiesService);

  }

  startWebSocketConnection(propertyId, listener) {

    this.propertyId = propertyId;
    this.addListener(listener);
    this.buildNotificationTo();

    if (this.websocket == null) {
      // getWebScoket does 
      // var ws: WebSocket = new WebSocket(apiUrl);
      // so, lets just use it in case is the first websocket
      this.getWebSocket().subscribe((websocket: WebSocket) => {
        this.websocket = websocket;
      });
    }



  }

  /**
   * 
   * @param ws 
   * @param message 
   */
  onWebSocketMessage(ws: WebSocket, message) {
    super.onWebSocketMessage(ws, message);

    let data = JSON.parse(message.data);

    this.listeners.forEach(listener => {
      listener.onMessage(data);
    });

  }

  onWebSocketOpen(websocket) {
    console.log("websocket connection has been successfully opened :)");

    const data = {
      to: this.notificationTo,
      app: NotificationService.APP_NAME
    }

    //sending data to receive notification
    //using app and to filter
    websocket.send(JSON.stringify(data));
  }

  clearListeners() {
    this.listeners = [];
  }
  addListener(listener: NotificationListener) {
    this.listeners.push(listener);
  }

  private buildNotificationTo() {
    if (this.notificationTo == null) {
      this.notificationTo = NotificationService.APP_NAME + "-" + this.propertyId;
    }
  }

}

