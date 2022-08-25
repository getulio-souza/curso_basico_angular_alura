import { OrderEventService } from "./../../../../../services/order/order-event.service";
import { Component, OnInit } from "@angular/core";
import { CollumnDefinition } from "../../../../dynamic-widgets/collapse-grid/collapse-grid.component";
import { OrderWardQuantityDTO } from "../../../model/ordar-ward-quantity.dto";
import { Subject } from "rxjs";

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

  private loadingSubject: Subject<void> = new Subject<void>();

  constructor(private orderEventService: OrderEventService) {}

  ngOnInit() {}

  private topFiveWardsAndOppenedOrdersQuantityForTable(
    ward,
    category,
    subject,
    start,
    end
  ): void {
    this.orderEventService
      .topFiveWardsAndOppenedOrdersQuantity(ward, category, subject, start, end)
      .subscribe((response: OrderWardQuantityDTO[]) => {
        this.data = response.map((ward) => {
          this.loadingSubject.next();
          return Object.assign(
            {},
            { ward: ward.ward, quantity: ward.quantity }
          );
        });
      });
  }
}
