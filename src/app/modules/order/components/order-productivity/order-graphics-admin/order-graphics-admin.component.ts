import { CHART_INDEX } from "../../../../nps/components/nps-page/nps-page.component";
import { CHART_TYPES } from "../../../../dynamic-widgets/charts/charts.component";
import { SingleDataStatistics } from "../../produtividade/produtividade.component";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-order-graphics-admin",
  templateUrl: "./order-graphics-admin.component.html",
  styleUrls: ["./order-graphics-admin.component.scss"],
})
export class OrderGraphicsAdminComponent implements OnInit {
  @Input() halfHourData: SingleDataStatistics[] = [];
  @Input() topFiveOppened: SingleDataStatistics[] = [];
  @Input() afterSlaData: SingleDataStatistics[] = [];
  @Input() seletorWards: string[] = [];
  @Input() seletorSubjects: string[] = [];

  @Input() cols: any[];
  @Input() data: any[];

  @Input() selectedFilterEvent: (event) => void;
  @Input() clickPizza: (event: { to: string; value: any }) => void;
  @Input() afterSlaChartClickEvent: (event: { to: string; value: any }) => void;
  @Input() halfChartClickEvent: (event: {
    to: string;
    value: any;
    extras: any;
  }) => void;

  CHART_TYPES = CHART_TYPES;
  CHART_INDEXES = CHART_INDEX;

  constructor() {}

  ngOnInit() {}
}
