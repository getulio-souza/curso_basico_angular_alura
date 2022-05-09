// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  authConfig: {
    domain: "dev-9grk-oh6.us.auth0.com",
    clientID: 'YtMnRK6N7AWHqriY9PfpYT4VcpSQvoBi',
    audience: 'https://proxper-auth.deltix.alis.solutions'
  },

  timeToRefreshRealTimeDevices: 30000,
  dataBaseUrl: 'http://localhost:8070/data/',
  numberOfWeeks: 12,
  propertyId: "deltixboutiquehotel",
  realTimeDevices: {
    chillerId: ['copapalace.Bacnet.chiller01'],
    powerRealTimeId: ['power1234'],
    coldChambers: [
      {
        id: 'copapalace.Bacnet.coldchamber01',
        name:  'Camara Fria Açougue Resfriado Carne'
      },
      {
        id: 'copapalace.Bacnet.coldchamber02',
        name:  'Camara Fria Confeitaria Congelado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber03',
        name:  'Camara Fria Confeitaria Resfriado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber04',
        name:  'Camara Fria Gelo'
      },
      {
        id: 'copapalace.Bacnet.coldchamber05',
        name:  'Camara Fria Banquete Resfriado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber06',
        name:  'Camara Fria Banquete Congelado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber07',
        name:  'Camara Fria Açougue Congelado Pescado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber08',
        name:  'Camara Fria Açougue Resfriado Pescado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber09',
        name:  'Camara Fria Açougue Congelado Carne'
      },
      {
        id: 'copapalace.Bacnet.coldchamber10',
        name:  'Camara Fria Açougue Legumes'
      },
      {
        id: 'copapalace.Bacnet.coldchamber11',
        name:  'Camara Fria Açougue Laticinios'
      },
      {
        id: 'copapalace.Bacnet.coldchamber12',
        name:  'Camara Fria Cozinha Central Resfriado'
      },
      {
        id: 'copapalace.Bacnet.coldchamber13',
        name:  'Camara Fria Cozinha Central Congelado'
      },
      {
        id:'copapalace.Bacnet.coldchamber14',
        name:'Camara Fria Cipriani Pescado'
      },
      {
        id:'copapalace.Bacnet.coldchamber15',
        name:'Camara Fria Cipriani Legumes'
      },
      {
        id:'copapalace.Bacnet.coldchamber16',
        name:'Camara Fria Cipriani Carnes'
      },
      {
        id:'copapalace.Bacnet.coldchamber17',
        name:'Camara Fria Mee'
      }],
    geralMainBuildingId: ['copapalace.Bacnet.wattmeter1'],
    secondaryMainBuilding: ['copapalace.Bacnet.wattmeter2'],
    geralAnnexBuildingId: ['copapalace.Bacnet.wattmeter3'],
    secondayAnnexBuildingId: ['copapalace.Bacnet.wattmeter4'],
    qgbtCagId:['copapalace.Bacnet.wattmeter5'],
    qegCag1Id:['copapalace.Bacnet.wattmeter6'],
    qegCag2Id:['copapalace.Bacnet.wattmeter7'],
    qfTowersId:['copapalace.Bacnet.wattmeter8'],
    mainBuildingCompanyId: ['mainBuildingCompany1234'],
    annexBuildingCompanyId: ['annexBuildingCompany1234'],
    coldChamberEvolutixId: ['coldChamberEvolutix1234'],
    //cagId: ['copapalace.Bacnet.wattmeter5'],
    //pumpsId: ['copapalace.Bacnet.wattmeter6'],
    termometerId: ['copapalace.Bacnet.thermometer01'],
    hygrometerId: ['copapalace.Bacnet.hygrometer01'],
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
