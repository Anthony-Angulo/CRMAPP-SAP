import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { NotificationsService } from "src/app/services/notifications.service";
import { ToastController } from "@ionic/angular";
import { OrderService } from "src/app/services/order.service";
import { CurrencyRateService } from "../../../services/currency.service";

@Component({
  selector: "app-ordermain",
  templateUrl: "./orderMain.page.html",
  styleUrls: ["./orderMain.page.scss"],
})
export class OrderMainPage implements OnInit {
  orderList = [];
  pendingOrderList = [];
  CanSale: boolean = false;
  button_size: string;
  screen_width: number;
  notificationCounts = 0;

  constructor(
    public plt: Platform,
    public notificationService: NotificationsService,
    private orderService: OrderService,
    public toastController: ToastController,
    public CurrencyRateService: CurrencyRateService
  ) {
    plt.ready().then((readySource) => {
      this.screen_width = plt.width();
    });
  }
  getOrders() {
    this.orderService.getOrders().then((orderList) => {
      this.orderList = orderList || [];
    });

    this.orderService.getPendingOrders().then((orderList) => {
      this.pendingOrderList = orderList || [];
      console.log(this.pendingOrderList);
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
  ngOnInit() {
    this.CurrencyRateService.getDataFromDatabase().catch((data) => {
      this.presentToast("No se ha actualizado el tipo de cambio");
      this.CanSale = true;
    });
    if (this.screen_width < 550) {
      this.button_size = "default";
    } else {
      this.button_size = "large";
    }
    this.getOrders();
  }

  ionViewWillEnter() {
    this.notificationService.getNotifications().then((notificationList) => {
      const notifications = notificationList.filter(
        (notification) => notification.seen == false
      );
      this.notificationCounts = notifications.length;
    });
  }
}
