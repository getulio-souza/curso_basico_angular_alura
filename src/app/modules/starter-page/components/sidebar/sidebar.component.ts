import {
  Component,
  AfterViewChecked,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from "@angular/core";
declare const $: any;
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { StructureService } from "@alis/tracking-ng";
import { PropertiesService } from "@alis/ng-services";
import { TranslateService } from "@ngx-translate/core";
import { PropertyDataLoader } from "../../../../home/propertyDataLoader";
import { ContextService } from "../../../../services/context/context.service";
import { AuthenticationService } from "../../../../shared/services/authentication.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent
  extends PropertyDataLoader
  implements AfterViewChecked
{
  @Input() showChangeProperty;

  //false closes sidebar
  //true opens sidebar
  @Output() onSidebarChangeEmitter = new EventEmitter<boolean>();
  @Output() onSidebarToggleEmitter = new EventEmitter<any>();

  itemClicked: string = "home";
  el: ElementRef;
  links: any;

  logoUrl;
  tabs = [];

  showRedirectBackoffice: boolean;

  constructor(
    el: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private contextService: ContextService,
    structureService: StructureService,
    propertiesService: PropertiesService,
    translateService: TranslateService
  ) {
    super(translateService, structureService, propertiesService);

    this.el = el;
    this.loadData(() => {
      this.afterPropertyHasBeenLoaded();
    });
  }

  // ngOnDestroy(): void {
  //   this.chartsObservable.unsubscribe();
  // }

  afterPropertyHasBeenLoaded() {
    this.links = this.el.nativeElement.querySelectorAll(
      '[data-toggle="tooltip"]'
    );

    this.loadSideBarConfig();

    this.buildItemClicked();

    // initial check in case we go direct to
    // propertyApp/propertyId/housekeeping
    // sidebar should highlight housekeeping
    let currentUrl = this.router.url;
    let urlParts = currentUrl.split("/");
    urlParts.forEach((urlPart) => {
      let item = this.getItemClicked(urlPart);
      if (item != null) {
        this.itemClicked = item;
        return;
      }
    });

    this.onRouterChange();
  }

  onRouterChange() {
    // on router change
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        //waiting to NavigationEnd event
        //val.url is something like '/propertyApp/propertyIt/home'
        let urlParts = val.url.split("/")[3];

        let item = this.getItemClicked(urlParts);
        if (item != null) {
          this.itemClicked = item;
          this.onSidebarChangeEmitter.emit(false);
        }
      }
    });
  }

  getItemClicked(urlPart) {
    // handles case
    // propertyApp/nucwework/roomControl;roomId=103101;floorId=main.floor_32
    // its still a roomControl case but with some parameters
    if (urlPart == null) {
      return null;
    }
    let urlSubParts = urlPart.split(";");

    for (let i = 0; i < urlSubParts.length; i++) {
      if (this.tabs.includes(urlSubParts[i])) {
        return urlSubParts[i];
      }
    }

    return null;
  }

  showTab(tabName) {
    return this.tabs.includes(tabName);
  }

  buildItemClicked() {
    // if page is being loaded direct to a specific page
    // like /engineering, it shoud change 'itemClicked'

    const url = this.router.url;
    if (url) {
      //something like /engineering
      const routerName = url.split("/")[1];
      if (routerName) {
        //if its a known router
        if (this.showTab(routerName)) {
          this.itemClicked = routerName;
        }
      }
    }
  }

  loadSideBarConfig() {
    let sideBarConfig = this.properties["sidebar"];
    this.showRedirectBackoffice = this.properties["showRedirectBackoffice"];
    this.showChangeProperty = !this.showRedirectBackoffice;

    console.log("config sidebar: ", sideBarConfig);
    console.log("redirect to backoffice: ", this.showRedirectBackoffice);

    if (!sideBarConfig) {
      console.error("Could not find 'sidebar' in appConfig");
      this.logoUrl = null;
      this.tabs = [];
      return;
    }

    this.logoUrl = sideBarConfig["logo"];

    if (!this.logoUrl) {
      console.error("Could not find 'logo' in appConfig.sidebar config ");
      this.logoUrl = null;
    }

    this.buildAllowedTabs(sideBarConfig);
  }

  buildAllowedTabs(sideBarConfig) {
    const rolesConfig = sideBarConfig["roles"];
    const tabsFromConfig = sideBarConfig["tabs"];
    this.tabs = new Array();
    this.contextService.allowedTabs = new Array();

    if (rolesConfig == null) {
      // there is no role defined in proxper config
      // lets add all tabs in config
      // to the avaiable routes
      this.tabs = tabsFromConfig != null ? tabsFromConfig : [];
    } else {
      // there is role defined in proxper config
      const userMetadata = {
        roles: this.authService
          .getPermission()
          .map((value) => value.permission),
      };

      if (
        userMetadata != null &&
        userMetadata.roles != null &&
        userMetadata.roles.length != 0
      ) {
        const userMetadataRoles = userMetadata.roles;

        userMetadataRoles.forEach((userRole) => {
          const tabRoles = rolesConfig[userRole];
          if (tabRoles != null) {
            this.tabs = this.tabs.concat(tabRoles);
          } else {
            console.warn(
              "Role '" +
                userRole +
                "' is defined in user metadata but this role is not in the proxper config"
            );
          }
        });
      } else {
        console.warn(
          `Usermetada was null or doesnt have any roles but
          there is a role config in proxper config.
          The user will not be able to access any tab`
        );
      }
    }

    this.contextService.allowedTabs = this.tabs;
  }

  ngAfterViewChecked() {
    // this.links.forEach((link) => $(link).tooltip() );
  }

  changeMenu(item) {
    this.itemClicked = item;
    this.goToRoute(item);
  }

  goToRoute(routerName: string) {
    if (routerName == "home") {
      this.onSidebarChangeEmitter.emit(true);
    } else {
      //any other
      this.onSidebarChangeEmitter.emit(false);
    }

    this.router.navigate([routerName], { relativeTo: this.activatedRoute });
  }

  toggleSidebar() {
    this.onSidebarToggleEmitter.emit();
  }

  activeTooltip(activate: boolean = true) {
    const options = activate ? { container: "body" } : "destroy";
    this.links.forEach((link) => $(link).tooltip(options));
  }

  leaveProperty() {
    this.router.navigateByUrl("/selectProperty");
  }

  redirectUrl() {
    window.location.href = `${this.properties["urlBackoffice"]}`;
  }
}
