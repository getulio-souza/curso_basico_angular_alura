import { OrderEventService } from "./../../../../../services/order/order-event.service";
import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-order-table",
  templateUrl: "./order-table.component.html",
  styleUrls: ["./order-table.component.scss"],
})
export class OrderTableComponent implements OnInit {
  @Input() cols: any[];
  @Input() data: any[];

  private loadingSubject: Subject<void> = new Subject<void>();

  constructor(private orderEventService: OrderEventService) {}

  ngOnInit() {}
}
