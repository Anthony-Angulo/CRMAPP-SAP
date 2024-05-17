import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";
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
  selector: "app-orderlistSAP",
  templateUrl: "./orderlistSAP.page.html",
  styleUrls: ["./orderlistSAP.page.scss"],
})
export class OrderListPageSAP implements OnInit {
  Status = Status;
  backgrounds = backgrounds;

  orderList = [];
  pendingOrderList = [];

  constructor(
    private orderService: OrderService,
    public toastController: ToastController,
    private userService: UserService,
    private http: HttpClient,
    public loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: "Obteniendo Ordenes SAP B1 ...",
    });

    await loading.present();

    await this.orderService
      .getDataFromDatabase()
      .then(() => {
        this.getOrders();
      })
      .catch((error) => {
        this.orderList = [];
        if (error.status == 404) {
          this.presentToast("No tiene Ordenes hoy.");
        } else {
          this.presentToast("Error al Actualizar. " + error);
        }
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async getOrders() {
    await this.orderService.getOrders().then((orderList) => {
      this.orderList = orderList || [];
    });

    console.log(this.orderList.length);

    this.orderService.getPendingOrders().then((orderList) => {
      this.pendingOrderList = orderList || [];
    });
  }

  doRefresh(event) {
    this.orderService
      .getDataFromDatabase()
      .then(() => {
        this.getOrders();
      })
      .catch((error) => {
        this.orderList = [];
        if (error.status == 404) {
          this.presentToast("No tiene Ordenes hoy.");
        } else {
          this.presentToast("Error al Actualizar. " + error);
        }
      })
      .finally(() => {
        event.target.complete();
      });
  }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data,
      duration: 5000,
    });
    toast.present();
  }
}
