import { Component, OnInit } from "@angular/core";
import {
  ToastController,
  ModalController,
  LoadingController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { OrderService } from "src/app/services/order.service";
import { UserService } from "src/app/account/services/user.service";

@Component({
  selector: "app-orderpendingdetail",
  templateUrl: "./orderPendingDetail.page.html",
  styleUrls: ["./orderPendingDetail.page.scss"],
})
export class OrderPendingDetailPage implements OnInit {
  index;
  order: any;
  disableButton = false;
  _SAP_IP: any;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private storage: Storage,
    public toastController: ToastController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get("id");
    this.orderService.getPendingOrder(this.index).then((order) => {
      this.order = order;
    });
  }

  delete() {
    this.orderService.deletePendingOrder(this.index).then((msg) => {
      this.toDashboard(msg);
    });
  }

  toDashboard(message) {
    Swal.fire({
      title: message,
      type: "success",
      confirmButtonText: "Enterado.",
    }).then((result) => {
      if (result.value) {
        this.router.navigate(["dashboard"]);
      }
    });
  }

  async send() {
    this.disableButton = true;
    const output = this.orderService.formatOrder(this.order);

    const loading = await this.loadingController.create({
      message: "Guardando Orden...",
    });
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    await loading.present();
    this.http
      .post(this._SAP_IP + "/Order/SeparateOrder", output)
      .toPromise()
      .then((value) => {
        this.orderService.deletePendingOrder(this.index);
        this.toDashboard("Pedido Guardado Con Exito.");
      })
      .catch(async (error) => {
        if (error.status == 409) {
          const reason = error.error.map((e) => e.AUTH).join(" ");
          const outputCRM = this.orderService.formatOrderCRMAuth(
            this.order,
            reason,
            1
          );
          await this.http
            .post(this._SAP_IP + "/OrdersAuth", outputCRM)
            .toPromise()
            .then((data) => {
              this.orderService.deletePendingOrder(this.index);
              this.toDashboard(
                "Pedido Guardado. Esperando Autorizacion." + reason
              );
            })
            .catch((error) => {
              console.error(error);
              this.presentToast(error);
            });
        } else {
          this.presentToast(error.error);
          console.error(error);
        }
      })
      .finally(() => {
        this.disableButton = false;
        loading.dismiss();
      });
  }

  presentToast(data: any) {
    this.toastController
      .create({
        message: data,
        duration: 5000,
      })
      .then((toast) => toast.present());
  }
}
