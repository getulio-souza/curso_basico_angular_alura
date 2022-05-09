import { Component, Input, OnDestroy } from '@angular/core';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';
import { PropertyDataLoader } from '../../../../home/propertyDataLoader';
import { NotificationListener, PropertyState, NotificationService } from '../../../../services/notification/notification.service';
import { DataService, TraceType } from '../../../../services/data/data.service';


enum MESSAGE_TYPE {
  SUCCESS = "success",
  WARNING = "warn",
  ERROR = "error",
}


@Component({
  selector: 'app-notification-messages',
  templateUrl: './notification-messages.component.html',
  styleUrls: ['./notification-messages.component.scss']
})
export class NotificationMessagesComponent extends PropertyDataLoader implements NotificationListener, OnDestroy {

  public static readonly TIME_TO_UPDATE_PROPERTY_STATE = 5 * 60 * 1000;
  public static readonly TIME_TO_UPDATE_PROPERTY_STATE_AFTER_CONNECTION_ERROR = 30 * 1000;
  public static readonly TIME_TO_DISMISS_SUCCESS_MESSAGE = 10 * 1000;

  private readonly PROPERTY_STATUS_ONLINE = "online";
  private readonly PROPERTY_STATUS_OFFLINE = "offline";
  private readonly PROPERTY_STATUS_STALE = "stale";

  private readonly MESSAGE_TITLE_PROPERTY_ONLINE = "Property online";
  private readonly MESSAGE_TITLE_PROPERTY_STALE = "Connection unstable";
  private readonly MESSAGE_TITLE_PROPERTY_OFFLINE = "Property offline";
  private readonly MESSAGE_TITLE_CONNECTION_ERROR = "Connection error";


  private readonly MESSAGE_BODY_PROPERTY_ONLINE = "Communication with the property has been reestablished";
  private readonly MESSAGE_BODY_PROPERTY_STALE = "Communication with the property is unsteady";
  private readonly MESSAGE_BODY_PROPERTY_OFFLINE = "No communication with the property";
  private readonly MESSAGE_BODY_CONNECTION_ERROR = "Error trying to connect to server. Please check your connection";

    
  //message info
  backgroundColor;
  titleMessage = null;
  detailMessage = null;
  severityMessage = null;
  showNotificationMessage = false;
  //message info


  //last message info
  //can be used when language is changed
  lastTitleMessage = null;
  lastDetailMessage = null;
  lastSeverityMessage = null;
  lastIsMessageClosable = null;
  //last message info

  showConnectionErrorCount = 0;
  
  msgs = [];
  isMessageClosable;

  lastPropertyState: PropertyState = PropertyState.ONLINE;

  propertyStateInterval;
  intervalToDismissSuccessMessage

  constructor(
    notificationService: NotificationService,
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    private dataService: DataService
  ) {

    super(translateService, structureService, propertiesService);

    this.translateService.onLangChange.subscribe((event) => {
      this.showSingleMessage(this.lastSeverityMessage, this.lastTitleMessage, this.lastDetailMessage, this.lastIsMessageClosable);
    });

    this.loadData(() => {
      notificationService.startWebSocketConnection(this.propertyId, this);
      this.getPropertyState();
      this.startIntervalToGetPropertyState(NotificationMessagesComponent.TIME_TO_UPDATE_PROPERTY_STATE);
    })

  }

  ngOnDestroy() {
    if (this.propertyStateInterval != null) {
      clearInterval(this.propertyStateInterval);
    }
  }
  onMessage(message) {
    let event = message.event;

    let isAValidEvent = true;

    if (event == PropertyState.OFFLINE) {
      this.lastPropertyState = PropertyState.OFFLINE;
      this.showSingleMessage(MESSAGE_TYPE.ERROR, this.MESSAGE_TITLE_PROPERTY_OFFLINE, this.MESSAGE_BODY_PROPERTY_OFFLINE, false);

    } else if (event == PropertyState.STALE) {
      this.lastPropertyState = PropertyState.STALE;
      this.showSingleMessage(MESSAGE_TYPE.WARNING, this.MESSAGE_TITLE_PROPERTY_STALE, this.MESSAGE_BODY_PROPERTY_STALE, false);

    } else if (event == PropertyState.OFFLINE_BACK_ONLINE) {
      this.lastPropertyState = PropertyState.ONLINE;
      this.showSingleMessage(MESSAGE_TYPE.SUCCESS, this.MESSAGE_TITLE_PROPERTY_ONLINE, this.MESSAGE_BODY_PROPERTY_ONLINE, true);

    } else if (event == PropertyState.STALE_BACK_ONLINE) {
      this.lastPropertyState = PropertyState.ONLINE;
      this.showSingleMessage(MESSAGE_TYPE.SUCCESS, this.MESSAGE_TITLE_PROPERTY_ONLINE, this.MESSAGE_BODY_PROPERTY_ONLINE, true);
    } else {
      isAValidEvent = false;
    }


    //just logging
    if (isAValidEvent) {
      console.log("Received ws message with event '" + event + "'");
    } else {
      console.warn("Received a ws message", message, " with unknown event '" + event + "'");
    }
  }

  startIntervalToGetPropertyState(interval) {
    console.log("starting getting property state using interval: "  + interval + " ms");
    if(this.propertyStateInterval != null){
      console.log("Cancelling old property state interval...");
      clearInterval(this.propertyStateInterval);
    }
    this.propertyStateInterval = setInterval(() => {
      this.getPropertyState();
    }, interval);

  }

  getPropertyState() {

    
    /*
      since property is being considered a device
      we can call this endpoint to get the current property state
    */
    this.dataService.getDevicesStateByOwnerAndTraceType(this.propertyId, TraceType.PROPERTY_STATUS).subscribe((responses) => {
      let currentState: PropertyState;
      
      let stateResponse;
      let status;

      if (responses != null) {
        //since its a property we know there is just one
        stateResponse = responses[0];

        // since property is a device
        // we expect just one
        if(responses.length > 1) {
          console.warn("Received more than 1 'property' for propertyId '" + this.propertyId + "'. Responses: ", responses);
        } 

      }

      if (stateResponse == null) {
        //unknown state
        status = null;
      } else {
        status = stateResponse.status;
      }

      if (status == this.PROPERTY_STATUS_ONLINE) {
        console.log('Property is being considered online cause received state as ', stateResponse);
        currentState = PropertyState.ONLINE;
      } else if (status == this.PROPERTY_STATUS_STALE) {
        console.log('Property is being considered stale cause received state as', stateResponse);
        currentState = PropertyState.STALE;
      } else if (status == this.PROPERTY_STATUS_OFFLINE) {
        console.log('Property is being considered offline cause received state as', stateResponse);
        currentState = PropertyState.OFFLINE;
      } else if (status == null){
        console.log('Property is being considered without connection cause received state as', stateResponse);
        currentState = null;
      }

      if (this.lastPropertyState != currentState) {
        //is different since last check
        if (currentState == PropertyState.ONLINE) {
          this.showSingleMessage(MESSAGE_TYPE.SUCCESS, this.MESSAGE_TITLE_PROPERTY_ONLINE, this.MESSAGE_BODY_PROPERTY_ONLINE, true);
        } else if (currentState == PropertyState.STALE) {
          this.showSingleMessage(MESSAGE_TYPE.WARNING, this.MESSAGE_TITLE_PROPERTY_STALE, this.MESSAGE_BODY_PROPERTY_STALE, true);
        } else if (currentState == PropertyState.OFFLINE) {
          this.showSingleMessage(MESSAGE_TYPE.ERROR, this.MESSAGE_TITLE_PROPERTY_OFFLINE, this.MESSAGE_BODY_PROPERTY_OFFLINE, false);
        } else if (currentState == null) {
          //there is a response but with no current state
          this.showConnectionError();
          this.startIntervalToGetPropertyState(NotificationMessagesComponent.TIME_TO_UPDATE_PROPERTY_STATE_AFTER_CONNECTION_ERROR);
        }

        if(this.lastPropertyState == null && currentState != null){
          //was null but is not anymore, so we have a valid data from now on
          //lets go back to normal interval
          this.startIntervalToGetPropertyState(NotificationMessagesComponent.TIME_TO_UPDATE_PROPERTY_STATE);
        }
      }

      this.lastPropertyState = currentState;
    },
      (error) => {
        console.error(error);
        if(this.lastPropertyState != null){
          this.showConnectionError();
          this.showConnectionErrorCount = 1;
          this.startIntervalToGetPropertyState(NotificationMessagesComponent.TIME_TO_UPDATE_PROPERTY_STATE_AFTER_CONNECTION_ERROR);
        }
      
        this.lastPropertyState = null;
                  
        if(this.showConnectionErrorCount == 0 || this.showConnectionErrorCount == 5){
          this.showConnectionErrorCount = 1;
          this.showConnectionError();
        } else {
          this.showConnectionErrorCount ++;
        }
      }
    );
  }

  showConnectionError() {
    console.error("Error trying to get state for owner id '" + this.propertyId + "'");
    this.showSingleMessage(MESSAGE_TYPE.ERROR, this.MESSAGE_TITLE_CONNECTION_ERROR, this.MESSAGE_BODY_CONNECTION_ERROR, true);
    
    
  }

  setBackGroundColor(severity: MESSAGE_TYPE){
    switch (severity) {
      case MESSAGE_TYPE.ERROR:
        this.backgroundColor = 'linear-gradient(to right, #cf4545 60%, #d44747)';
        break;
      case MESSAGE_TYPE.WARNING:
        this.backgroundColor = 'linear-gradient(to right, #d09520 50%, #fcb527)';
        break;
      case MESSAGE_TYPE.SUCCESS:
        this.backgroundColor = 'linear-gradient(to right, #00795d 60%, #00dca9)';
      default:
        break;
    }
  }



  showSingleMessage(severity: MESSAGE_TYPE, title, detail, isMessageClosable ) {

    if(severity == null || title == null || detail == null){
      //Could not show nofication message cause received null values
      return ;
    }

    this.lastSeverityMessage = severity;
    this.lastTitleMessage = title;
    this.lastDetailMessage = detail;
    this.lastIsMessageClosable = isMessageClosable;

    this.clearMessages();
    
    this.isMessageClosable = isMessageClosable;
    this.showNotificationMessage = true;
    this.severityMessage = severity;
    this.setBackGroundColor(severity);


    if (this.intervalToDismissSuccessMessage != null) {
      //if a new message need to be shown
      //lets clear last interval to avoid dismiss new message
      clearInterval(this.intervalToDismissSuccessMessage);
    }


    // translates and pushes new message
    this.translateService.get([title, detail]).subscribe(translation => {
        this.titleMessage = translation[title];
        this.detailMessage = translation[detail];
    });

    // if its a success message, should cancel message after some time
    if (severity == MESSAGE_TYPE.SUCCESS) {
      this.intervalToDismissSuccessMessage = setTimeout(() => {
        this.clearMessages();
      }, NotificationMessagesComponent.TIME_TO_DISMISS_SUCCESS_MESSAGE);
    }
  }

  clearMessages() {
    this.showNotificationMessage = false;
  }
}

