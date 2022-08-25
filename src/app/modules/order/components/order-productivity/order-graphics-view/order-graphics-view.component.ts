import { SingleDataStatistics } from "../../../../nps/components/nps-page/nps-page.component";
import { CHART_TYPES } from "../../../../dynamic-widgets/charts/charts.component";
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

  teste = [
    {
      label: "teste 1",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 3",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 2",
      value: [1, 2, 3, 4],
      week: null,
    },
    {
      label: "teste 4",
      value: [1, 2, 3, 4],
      week: null,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
