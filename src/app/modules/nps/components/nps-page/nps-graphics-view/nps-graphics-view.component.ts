import { CHART_INDEX } from "./../nps-page.component";
import { Component, Input, OnInit } from "@angular/core";
import { CHART_TYPES } from "../../../../dynamic-widgets/charts/charts.component";
import { SingleDataStatistics } from "../nps-page.component";

@Component({
  selector: "app-nps-graphics-view",
  templateUrl: "./nps-graphics-view.component.html",
  styleUrls: ["./nps-graphics-view.component.scss"],
})
export class NpsGraphicsViewComponent implements OnInit {
  @Input() globalSatisfactionData: SingleDataStatistics[] = [];
  @Input() npsByCategoryData: SingleDataStatistics[] = [];
  @Input() npsClosedOrdersData: SingleDataStatistics[] = [];
  @Input() categoriesNpsLowerThanSevenData: SingleDataStatistics[] = [];

  @Input() selectedCategoryNpsByCategoryFilter: string;
  @Input() seletorCategoryNPSByCategoryDataChart: string;
  @Input() selectedFilterEvent: (event, chartIndex) => void;
  @Input() selectedCategoryClosedOrdersFilter: string;
  @Input() seletorCategoryClosedOrdersDataChart: string[] = [];

  CHART_TYPES = CHART_TYPES;
  CHART_INDEXES = CHART_INDEX;

  constructor() {}

  ngOnInit() {}
}
