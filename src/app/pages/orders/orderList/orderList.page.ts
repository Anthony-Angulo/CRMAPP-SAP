import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { UserService } from "src/app/account/services/user.service";
import { OrderService } from "src/app/services/order.service";
import { environment } from "src/environments/environment";
enum Status {
  "O" = "Abierto",
  "C" = "Cerrado",
  "X" = "Cancelada",
  "P" = "Parcial",
}
enum backgrounds {
  "O" = "green",
  "C" = "red",
}

@Component({
  selector: "app-orderlist",
  templateUrl: "./orderList.page.html",
  styleUrls: ["./orderList.page.scss"],
})
export class OrderListPage {
  Autorizaciones: boolean = true;
  AutorizacionesAuth: boolean = false;
  Status = Status;
  backgrounds = backgrounds;

  orderList = [];
  pendingOrderList = [];

  constructor(
    private orderService: OrderService,
    public toastController: ToastController,
    private userService: UserService,
    private http: HttpClient
  ) {}
  ShowAuth() {
    console.log("Auth");
    this.AutorizacionesAuth = true;
    this.Autorizaciones = false;
  }
  ShowSAP() {
    this.Autorizaciones = true;
    this.AutorizacionesAuth = false;
  }
}
