// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  timeToRefreshRealTimeDevices: 10000,
  dataBaseUrl: 'http://192.168.0.59:8070/data/',
  numberOfWeeks: 12,
  propertyId: "copapalace",
  realTimeDevices: {
    chillerId: ['Bacnet.chiller01'],
    powerRealTimeId: ['power1234'],
    coldChambers: [
      {
        id: 'Bacnet.coldchamber01',
        name:  'Camara Fria Açougue Resfriado Carne'
      },
      {
        id: 'Bacnet.coldchamber02',
        name:  'Camara Fria Confeitaria Congelado'
      },
      {
        id: 'Bacnet.coldchamber03',
        name:  'Camara Fria Confeitaria Resfriado'
      },
      {
        id: 'Bacnet.coldchamber04',
        name:  'Camara Fria Gelo'
      },
      {
        id: 'Bacnet.coldchamber05',
        name:  'Camara Fria Banquete Resfriado'
      },
      {
        id: 'Bacnet.coldchamber06',
        name:  'Camara Fria Banquete Congelado'
      },
      {
        id: 'Bacnet.coldchamber07',
        name:  'Camara Fria Açougue Congelado Pescado'
      },
      {
        id: 'Bacnet.coldchamber08',
        name:  'Camara Fria Açougue Resfriado Pescado'
      },
      {
        id: 'Bacnet.coldchamber09',
        name:  'Camara Fria Açougue Congelado Carne'
      },
      {
        id: 'Bacnet.coldchamber10',
        name:  'Camara Fria Açougue Legumes'
      },
      {
        id: 'Bacnet.coldchamber11',
        name:  'Camara Fria Açougue Laticinios'
      },
      {
        id: 'Bacnet.coldchamber12',
        name:  'Camara Fria Cozinha Central Resfriado'
      },
      {
        id: 'Bacnet.coldchamber13',
        name:  'Camara Fria Cozinha Central Congelado'
      },
      {
        id:'Bacnet.coldchamber14',
        name:'Camara Fria Cipriani Pescado'
      },
      {
        id:'Bacnet.coldchamber15',
        name:'Camara Fria Cipriani Legumes'
      },
      {
        id:'Bacnet.coldchamber16',
        name:'Camara Fria Cipriani Carnes'
      },
      {
        id:'Bacnet.coldchamber17',
        name:'Camara Fria Mee'
      }],
    geralMainBuildingId: ['Bacnet.wattmeter1'],
    secondaryMainBuilding: ['Bacnet.wattmeter2'],
    geralAnnexBuildingId: ['Bacnet.wattmeter3'],
    secondayAnnexBuildingId: ['Bacnet.wattmeter4'],
    qgbtCagId:['Bacnet.wattmeter5'],
    qegCag1Id:['Bacnet.wattmeter6'],
    qegCag2Id:['Bacnet.wattmeter7'],
    qfTowersId:['Bacnet.wattmeter8'],
    mainBuildingCompanyId: ['mainBuildingCompany1234'],
    annexBuildingCompanyId: ['annexBuildingCompany1234'],
    coldChamberEvolutixId: ['coldChamberEvolutix1234'],
    //cagId: ['Bacnet.wattmeter5'],
    //pumpsId: ['Bacnet.wattmeter6'],
    termometerId: ['Bacnet.thermometer01'],
    hygrometerId: ['Bacnet.hygrometer01'],
    otherDevices: [
      {
        id: 'device1',
        values: ['temp1','temp2','temp3']
      },
      {
        id: 'device2',
        values: ['setPoint1','temp1','temp2']
      },
      {
        id: 'device2',
        values: ['coldSetPoint','minimiumTemp','temp']
      }
    ]
  }
};
