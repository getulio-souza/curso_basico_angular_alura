import { ChartsObservable } from "./../../../dynamic-widgets/charts/charts.observable";
import { Component, OnInit } from "@angular/core";
import { PropertiesService } from "@alis/ng-services";
import { StructureService } from "@alis/tracking-ng";
import { TranslateService } from "@ngx-translate/core";
import { PropertyDataLoader } from "../../../../home/propertyDataLoader";
import {
  NotificationListener,
  NotificationService,
} from "../../../../services/notification/notification.service";
import { ContextService } from "../../../../services/context/context.service";
import { Router, ActivatedRoute, RouterStateSnapshot } from "@angular/router";
import { ProxperConfigService } from "../../../../services/proxperConfig/proxperConfig.service";
import { AuthenticationService } from "../../../../shared/services/authentication.service";

@Component({
  selector: "app-property-app",
  templateUrl: "./property-app.component.html",
  styleUrls: ["./property-app.component.scss"],
})
export class PropertyAppComponent
  extends PropertyDataLoader
  implements NotificationListener
{
  isSidebarOpen = true;

  msgs = [];
  isMessageClosable;
  appIsReady = false;
  availableProperties: Array<string>;

  propService: PropertiesService;
  proxperBaseUrl;
  moreThanOnePropertyOption;
  loggedIn: boolean;

  constructor(
    private auth: AuthenticationService,
    public proxperConfigService: ProxperConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    contextService: ContextService,
    private notificationService: NotificationService,
    private chartsObservable: ChartsObservable,
    translateService: TranslateService,
    structureService: StructureService,
    propertiesService: PropertiesService
  ) {
    super(translateService, structureService, propertiesService);
    this.propService = propertiesService;

    contextService.clearBuildingUnitFilter();

    contextService.changeEmitted.subscribe((res) => {
      this.toggleToolbar();
    });

    this.moreThanOnePropertyOption = contextService.moreThanOnePropertyOption;
  }

  async ngOnInit() {
    this.loggedIn = this.auth.isUserLoggedIn();
    await this.proxperConfigService.updateConfigAndAvailableProperties();
    this.afterSetConfigs();
  }

  afterSetConfigs() {
    this.activatedRoute.params.subscribe((params) => {
      let selectedProperty = params["propertyId"];
      if (
        !this.proxperConfigService
          .getAvailableProperties()
          .includes(selectedProperty)
      ) {
        this.router.navigateByUrl("/notFound");
        return;
      }

      // selected property is available
      this.startLoadData();
    });
  }

  onMessage(message) {}

  onSidebarChange(isSideBarOpen: boolean) {
    this.isSidebarOpen = isSideBarOpen;
  }

  onSidebarToggle(event) {
    this.toggleToolbar();
  }

  startLoadData() {
    // at this point, proxper configs url has already been set
    // it means that any 'loadData' will get the correct proxperConfig
    // and it will use propertyId from proxperConfig

    this.loadData(() => {
      this.notificationService.startWebSocketConnection(this.propertyId, this);
      this.appIsReady = true;
    });
  }

  toggleToolbar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.chartsObservable.next(true);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"], {
      queryParams: { url: this.router.routerState.snapshot.url },
    });
  }
}
