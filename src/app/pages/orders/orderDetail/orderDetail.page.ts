import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/services/order.service";
enum Status {
  "O" = "Abierto",
  "C" = "Cerrado",
  "X" = "Cancelada",
  "P" = "Parcial",
}
@Component({
  selector: "app-orderdetail",
  templateUrl: "./orderDetail.page.html",
  styleUrls: ["./orderDetail.page.scss"],
})
export class OrderDetailPage implements OnInit {
  Status = Status;
  order: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const index = this.route.snapshot.paramMap.get("id");
    this.order = await this.orderService.getOrder(index);
    console.log(new Date(this.order.U_FECHAREG_PEDIDO));
    this.orderService.getOrders().then((data) => {
      data = data.filter((x) => x.DocEntry == index);
      this.order.CANCELED = data[0].CANCELED;
      console.log(this.order);
    });
  }
}
