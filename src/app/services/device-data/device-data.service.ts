import { Injectable } from '@angular/core';

@Injectable()
export class DeviceDataService {


  fakeData = {
    "chiller-01": {
      generalSupply: 25,
      generalReturn: 27,
      condenInput: 22,
      condenOutput: 30,
      tempOutside: 27,
      externalHumidity: 80
    },
    power1234: {
      mainBuilding: 1020,
      annexBuilding: 950,
      cag: 850,
      pumps: 350
    },
    "Bacnet.coldchamber-01": {
      name: 'Cold Chamber 1',
      temperature: -6
    },
    "Bacnet.coldchamber-02": {
      name: 'Cold Chamber 2',
      temperature: -3
    },
    "Bacnet.coldchamber-03": {
      name: 'Cold Chamber 3',
      temperature: -2
    },
    "Bacnet.coldchamber-04": {
      name: 'Cold Chamber 4',
      temperature: -0
    },
    "Bacnet.coldchamber-05": {
      name: 'Cold Chamber 5',
      temperature: -5
    },
    "Bacnet.coldchamber-06": {
      name: 'Cold Chamber 6',
      temperature: 0
    },
    "Bacnet.coldchamber-07": {
      name: 'Cold Chamber 7',
      temperature: -7
    },
    "Bacnet.coldchamber-08": {
      name: 'Cold Chamber 8',
      temperature: -10
    },
    "Bacnet.coldchamber-09": {
      name: 'Cold Chamber 9',
      temperature: -12
    },
    "Bacnet.coldchamber-10": {
      name: 'Cold Chamber 10',
      temperature: 0
    },
    "Bacnet.coldchamber-11": {
      name: 'Cold Chamber 11',
      temperature: -3
    },
    "Bacnet.coldchamber-12": {
      name: 'Cold Chamber 12',
      temperature: -2
    },
    "Bacnet.coldchamber-13": {
      name: 'Cold Chamber 13',
      temperature: -4
    },
    "wattmeter-1": {
      "active-power": 1020
    },
    "wattmeter-2": {
      "active-power": 880
    },
    mainBuildingCompany1234: {
      "active-power": 1060
    },
    annexBuildingCompany1234: {
      "active-power": 750
    },
    coldChamberEvolutix1234: {
      frontTemp: -11,
      backRoomTemp: -4,
      foodSurfaceTemp: -3,
      airTemp: -6,
      isCompressorOn: true,
      isDoorOpen: true,
      isEvaporatorOn: true,
      humidity: 84
    },
    'wattmeter-4': {
      "active-power": 777
    },
    'wattmeter-3': {
      "active-power": 666
    },
  };

  constructor() { }


  getDeviceData(deviceId: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      resolve(this.fakeData[deviceId]);
    });

    return promise;
  }

}
