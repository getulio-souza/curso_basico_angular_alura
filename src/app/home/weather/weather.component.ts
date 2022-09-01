import { TranslateService } from "@ngx-translate/core";
import { PropertiesService } from "@alis/ng-services";
import { Component, NgZone, Input } from "@angular/core";
import { WeatherInfoComponent } from "@alis/customer-base";
import { HospitalityWeatherService } from "@alis/hospitality-ng";

@Component({
  selector: "home-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.scss"],
})
export class WeatherComponent extends WeatherInfoComponent {
  @Input() temperatureUomIsFahrenheit;
  @Input() hasLoadedProperties;

  translateService;
  ready = false;

  constructor(
    weatherService: HospitalityWeatherService,
    propertiesService: PropertiesService,
    zone: NgZone,
    translate: TranslateService
  ) {
    super(weatherService, propertiesService, zone, translate);
    this.translateService = translate;
  }

  ngOnInit() {
    this.weatherIconsFolder = "weather-white";
    super.ngOnInit();

    this.ready = true;
    //every onLangChange event
    //it should reload all component
    //to get correct translations
    this.translateService.onLangChange.subscribe((res) => {
      super.ngOnInit();
    });
  }
}
