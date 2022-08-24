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

  testeData: SingleDataStatistics[] = [];

  CHART_TYPES = CHART_TYPES;

  constructor() {}

  ngOnInit() {
    this.testeData = [
      {
        label: "Novo Teste",
        value: [1, 2, 3],
        week: 4,
      },
      {
        label: "Novo Teste 2",
        value: [1, 2, 3, 4],
        week: 3,
      },
      {
        label: "Novo Teste 3",
        value: [1, 2],
        week: 2,
      },
      {
        label: "Novo Teste 4",
        value: [1],
        week: 1,
      },
      {
        label: "Novo Teste 5",
        value: [1, 2, 3, 4, 5],
        week: 5,
      },
    ];
  }
}
