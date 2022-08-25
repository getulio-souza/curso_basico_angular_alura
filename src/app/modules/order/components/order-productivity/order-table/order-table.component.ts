import { Component, OnInit } from "@angular/core";
import { CollumnDefinition } from "../../../../dynamic-widgets/collapse-grid/collapse-grid.component";

@Component({
  selector: "app-order-table",
  templateUrl: "./order-table.component.html",
  styleUrls: ["./order-table.component.scss"],
})
export class OrderTableComponent implements OnInit {
  cols: CollumnDefinition[] = [
    { field: "ward", header: "Ala" },
    { field: "quantity", header: "Quantidade" },
  ];

  data = [];

  constructor() {}

  ngOnInit() {}
}
