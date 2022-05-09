import { PropertiesService } from '@alis/ng-services';
import { StructureService } from '@alis/tracking-ng';
import { TranslateService } from '@ngx-translate/core';

declare var navigator;

export class PropertyDataLoader {

    propertyId;
    properties;
    structure;
    cardsList: Array<any>;

    backgroundStyle;


    translateService: TranslateService;
    structureService: StructureService;

    constructor(translateService: TranslateService,
        structureService: StructureService,
        private propertiesService: PropertiesService) {

        this.translateService = translateService;
        this.structureService = structureService;
    }

    loadData(loadDataCallBack) {
        this.propertiesService.getAppConfig().subscribe(res => {
            this.properties = res;
            this.propertyId = this.properties['propertyId'];
            if (!this.propertyId) {
                console.warn("Cold not find propertyId in properties file");
                return;
            }

            if (this.translateService.getLangs().length == 0) {
                // no default nor current languages were set
                // its the first time 
                // lets set it
                this.prepareTranslateService();
            }

            this.backgroundStyle = this.getBackgroundStyle();
            this.buildFloorComponentData(loadDataCallBack);
        })
    }

    public buildFloorComponentData(loadDataCallBack) {

        // lets get structure for the given property
        this.structureService.getStructure(this.propertyId).subscribe((structureJson) => {

            this.prepareCardsListFromStructureJson(structureJson);
            loadDataCallBack();

        }, (error) => {
            console.log("Error trying to get structure for the given propertyId: " + this.propertyId);
        })
    }



    public prepareCardsListFromStructureJson(structureJson) {
        this.structure = structureJson;
        this.cardsList = [];
    }

    private prepareTranslateService() {

        //using 'en' as a fallback
        this.translateService.setDefaultLang("en");

        let languageFromConfig = this.properties['languageDefault'];

        if (languageFromConfig) {
            this.translateService.use(languageFromConfig);
        } else {
            console.error("Could not find 'languageDefault' in 'appConfig.properties', lets get from browser")
            //lets get from browser
            var userLang = navigator.language || navigator.userLanguage;
            if (userLang) {
                userLang = userLang.toLowerCase();
                var rootUserLanguage = this.getRootLanguage(userLang, languageFromConfig);
                this.translateService.use(rootUserLanguage);
            }
        }
    }


    private getRootLanguage(language: string, defaultLanguage): string {
        return (language) ? language.split("-")[0] : defaultLanguage;
    }

    private getBackgroundStyle() {

        let homeConfig = this.properties['home'];

        if (!homeConfig) {
            console.error("Could not find 'home' in appConfig");
            return null;
        }

        let backgroundUrl = homeConfig['background'];

        if (!backgroundUrl) {
            console.error("Could not find 'background' in appConfig.home config ");
            return null;
        }

        const styles = {
            'background': 'url(' + backgroundUrl + ') top center no-repeat #414851',
            'background-size': 'cover',
            'background-attachment': 'fixed'

        };

        return styles;
    }




}