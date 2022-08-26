import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-order-table",
  templateUrl: "./order-table.component.html",
  styleUrls: ["./order-table.component.scss"],
})
export class OrderTableComponent implements OnInit {
  @Input() cols: any[];
  @Input() data: any[];

  constructor() {}

  ngOnInit() {}
}
