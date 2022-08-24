import { SingleDataStatistics } from "./../../../../nps/components/nps-page/nps-page.component";
import { CHART_TYPES } from "./../../../../dynamic-widgets/charts/charts.component";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-order-graphics-view",
  templateUrl: "./order-graphics-view.component.html",
  styleUrls: ["./order-graphics-view.component.scss"],
})
export class OrderGraphicsViewComponent implements OnInit {
  halfHourData: SingleDataStatistics[] = [];
  topFiveOppened: SingleDataStatistics[] = [];
  afterSlaData: SingleDataStatistics[] = [];

  CHART_TYPES = CHART_TYPES;

  constructor() {}

  ngOnInit() {}
}
