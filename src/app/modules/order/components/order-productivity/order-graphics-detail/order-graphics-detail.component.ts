import { CHART_TYPES } from "./../../../../dynamic-widgets/charts/charts.component";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-order-graphics-detail",
  templateUrl: "./order-graphics-detail.component.html",
  styleUrls: ["./order-graphics-detail.component.scss"],
})
export class OrderGraphicsDetailComponent implements OnInit {
  @Input() opennedAdvance: any[] = [];
  @Input() categoriesAdvance: any[] = [];
  @Input() afterSlaAdvance: any[] = [];
  @Input() wardsAdvance: any[] = [];
  @Input() loading: boolean;

  CHART_TYPES = CHART_TYPES;

  constructor() {}

  ngOnInit() {}
}
