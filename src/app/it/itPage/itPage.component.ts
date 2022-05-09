import { PropertyDataLoader } from '../../home/propertyDataLoader';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { EventService } from '../../services/event/event.service';
import { DataService, TraceType } from '../../services/data/data.service';
import { RealTime } from '../../abstracts/realTime';


@Component({
  selector: 'app-it',
  templateUrl: './itPage.component.html',
  styleUrls: ['./itPage.component.scss']
})
export class ITPageComponent extends PropertyDataLoader implements OnInit {

  options;
  selectedCard;
  deviceTypeMap = new Map();
  realTime: RealTime;

  propertyStatusData;

  modelCards = [
    { id: 0, pathImg: 'assets/images/icon-devices.svg', label: 'All devices', deviceTypes: ['all'], traceTypes: ['all'] },
    { id: 1, icon: 'wb_incandescent', label: 'Light', deviceTypes: ['Relay', "Level"], traceTypes: ['relay', 'level'] },
    { id: 2, icon: 'desktop_windows', label: 'TV', deviceTypes: ['TV'], traceTypes: ['tv'] },
    { id: 3, icon: 'phonelink_setup', label: 'Mobiles', deviceTypes: ['Mobiles'], traceTypes: ['mobiles'] },
    { id: 4, icon: 'speaker_group', label: 'Thermostats', deviceTypes: ['Thermostat'], traceTypes: ['tko_thermostat'] },
    { id: 5, icon: 'calendar_view_day', label: 'Curtains', deviceTypes: ['Curtain'], traceTypes: ['curtain'] },
    { id: 6, icon: 'lock_open', label: 'Door sensor', deviceTypes: ['DoorSensor'], traceTypes: ['doorsensor'] },
    { id: 7, icon: 'invert_colors', label: 'Hygrometer', deviceTypes: ['Hygrometer'], traceTypes: ['hygrometer'] },
    { id: 8, icon: 'power', label: 'PowerMeters', deviceTypes: ['PowerMeter'], traceTypes: ['powermeter'] },
    { id: 9, icon: 'battery_charging_full', label: 'WattMeter', deviceTypes: ['WattMeter'], traceTypes: ['wattmeter'] },
    { id: 10, icon: 'device_unknown', label: 'Chiller', deviceTypes: ['Chiller'], traceTypes: ['chiller'] },
    { id: 11, icon: 'whatshot', label: 'Thermometer', deviceTypes: ['Thermometer'], traceTypes: ['thermometer'] },
    { id: 12, icon: 'device_unknown', label: 'ColdChamber', deviceTypes: ['ColdChamber'], traceTypes: ['coldchamber'] },
    { id: 13, icon: 'device_unknown', label: 'AdvancedColdChamber', deviceTypes: ['AdvancedColdChamber'], traceTypes: ['advancedcoldchamber'] },
    { id: 14, icon: 'person', label: 'Dnd', deviceTypes: ['DndMur'], traceTypes: ['dndmur'] },
    { id: 15, icon: 'person', label: 'Occupancy Sensor', deviceTypes: ['OccupancySensor'], traceTypes: ['occupancysensor'] },
  ];

  // owl carousel
  config: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    margin: 20,
    nav: true,
    lazyLoad: true,
    responsiveClass: false,
    navText: [
      '<i class="material-icons">keyboard_arrow_left</i>',
      '<i class="material-icons">keyboard_arrow_right</i>'
    ],
    navContainer: '.main-content .custom-nav',
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
  };


  // devices de owl carousel
  cards = [];

  constructor(
    private dataService: DataService,
    propertiesService: PropertiesService,
    structureService: StructureService,
    translateService: TranslateService,
    private eventsService: EventService
  ) {

    super(translateService, structureService, propertiesService);

    this.cards = [{}, {}, {}, {}, {}, {}];
    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });

  }

  ngOnInit() { }

  afterPropertyHasBeenLoaded() {
    let itConfig = this.properties.it;

    if (itConfig != null) {
      let categoryCardsConfig = itConfig.categoryCards;
      if (categoryCardsConfig != null) {
        this.updateModelCardsFromConfig(categoryCardsConfig);
      }
    }

    this.realTime = new RealTime();
    this.realTime.startGettingRealTimeData(() => {
      this.getPropertyStateSummary();
    });


  }

  updateAllCard(){

    let deviceTypesSet = new Set<string>();
    let traceTypesSet = new Set<string>();
    for(let i = 1; i<this.cards.length;i++){
      const modelCard = this.cards[i];
      modelCard.deviceTypes.forEach(deviceType => deviceTypesSet.add(deviceType));
      modelCard.traceTypes.forEach(traceType => traceTypesSet.add(traceType));
    }

    this.cards[0].deviceTypes = Array.from(deviceTypesSet);
    this.cards[0].traceTypes = Array.from(traceTypesSet);
  }


  updateModelCardsFromConfig(categoryCardsConfig) {
    // categoryCardsConfig is something line
    // {
    //   1: {
    //     'icon': 'xxx',
    //     'label': 'yyy',
    //     'deviceTypes': ['deviceType1', 'deviceType2']
    //   }
    // }

    this.modelCards.forEach(modelCard => {
      let id = modelCard.id;

      let currentConfig = categoryCardsConfig[id];
      if (currentConfig != null) {
        if (currentConfig.label != null) { modelCard['label'] = currentConfig.label; }
        if (currentConfig.icon != null) { modelCard['icon'] = currentConfig.icon; }
        if (currentConfig.deviceTypes != null) { modelCard['deviceTypes'] = currentConfig.deviceTypes; }
        if (currentConfig.traceTypes != null) { modelCard['traceTypes'] = currentConfig.traceTypes; }
      }
    });
  }

  compareTotal(a, b) {
    if (a.total > b.total) {
      return -1;
    }
    if (a.total < b.total) {
      return 1;
    }

    return 0;
  }

  /**
   * 
   * @param response receive a response object and
   * builds a sorted array by totalDevies
   * with devicetype and totalDevices
   */
  buildSortedResponseArray(response) {
    let responseArray = [];
    for (var property in response) {
      if (response.hasOwnProperty(property)) {
        // Do things here
        let data = null;
        if (property.includes("deviceTypeCount.")) {
          data = property.split("deviceTypeCount.");
        } else if (property.includes("DeviceTypeCount.")) {
          data = property.split("DeviceTypeCount.");
        }
        if (data != null) {
          let stateData = data[0];
          let deviceType = data[1];

          // responseArray.push({
          //   deviceType: deviceType,
          //   total: response[property]
          // });

          let deviceTypeData = this.deviceTypeMap.get(deviceType);
          if (deviceTypeData == null) { deviceTypeData = {}; }

          deviceTypeData['deviceType'] = deviceType;

          if (stateData == '') {
            //ex: "deviceTypeCount.PowerMeter"
            deviceTypeData['total'] = response[property];
          } else if (stateData == 'online') {
            //ex: "onlineDeviceTypeCount.PowerMeter"
            deviceTypeData['online'] = response[property];
          } else if (stateData == 'offline') {
            //ex: "offlineDeviceTypeCount.PowerMeter"
            deviceTypeData['offline'] = response[property];
          } else if (stateData == 'stale') {
            //ex: "staleDeviceTypeCount.PowerMeter"
            deviceTypeData['stale'] = response[property];
          }

          this.deviceTypeMap.set(deviceType, deviceTypeData);

        }
      }
    }

    this.deviceTypeMap.forEach((value, key, map) => {
      responseArray.push(value);
    });


    responseArray.sort(this.compareTotal);
    return responseArray;
  }


  getPropertyStateSummary() {
    this.dataService.getDevicesStateByOwnerAndTraceType(this.propertyId, TraceType.PROPERTY_STATUS).subscribe((responses: Array<any>) => {

      if (responses != null) {
        // since property is a device
        // we expect just one
        if (responses.length > 1) {
          console.warn("Received more than 1 'property' for propertyId '" + this.propertyId + "'. Responses: ", responses);
        }

        this.propertyStatusData = responses[0];
        //first, lets build allDevicesCard
        this.cards = [];
        this.buildAllDevicesCard(this.propertyStatusData);

        //then, lets build generic cards
        let responseArray = this.buildSortedResponseArray(this.propertyStatusData);
        this.buildGenericCards(responseArray);

        this.updateAllCard();
      }

    });
  }


  buildAllDevicesCard(response) {
    let allCard = this.modelCards[0];
    allCard['total'] = response['devicesCount'];
    allCard['online'] = response['onlineDevicesCount'];
    allCard['offline'] = response['offlineDevicesCount'];
    allCard['stale'] = response['staleDevicesCount'];
    this.cards.push(allCard);

    if (this.selectedCard == null) {
      // first time
      // it should start with 'all'
      this.selectedCard = this.cards[0];
    }

  }

  buildGenericCards(responseArray) {

    let alreadyAddedDeviceTypes = [];

    responseArray.forEach(data => {

      let indexs = this.findCardIndexByDeviceType(this.modelCards, data.deviceType);

      // lets remove item 0 ('all') because
      // we are just building generic cards here

      var index = indexs.indexOf(0);
      if (index > -1) {
        indexs.splice(index, 1);
      }

      // first, lets remove modelCards
      indexs.forEach(index => {
        let card = this.modelCards[index]
        card['total'] = null;
        card['online'] = null;
        card['offline'] = null;
        card['stale'] = null;
      });

      let total = data['total'];
      let online = data['online'];
      let offline = data['offline'];
      let stale = data['stale'];

      //then lets build with new data
      indexs.forEach(index => {
        if (index >= 0) {
          let card = this.modelCards[index];
          if (card['total'] == null) { card['total'] = 0; }
          if (card['online'] == null) { card['online'] = 0; }
          if (card['offline'] == null) { card['offline'] = 0; }
          if (card['stale'] == null) { card['stale'] = 0; }

          card['total'] += total;
          card['online'] += online;
          card['offline'] += offline;
          card['stale'] += stale;

          if (alreadyAddedDeviceTypes.includes(data.deviceType)) {
            //case we have more than one deviceType in same card
            return;
          } else {
            alreadyAddedDeviceTypes.push(data.deviceType);
            this.cards.push(card);
          }
        }
      });
    });
  }

  findCardIndexByDeviceType(cards, deviceType) {
    let indexs = [];
    for (var i = 0; i < cards.length; i++) {
      let deviceTypeList: Array<any> = cards[i].deviceTypes;
      if (deviceTypeList.includes(deviceType)) {
        indexs.push(i);
      }
    }
    return indexs;
  }

  onCardClick(card) {
    this.selectedCard = card;
  }


}
