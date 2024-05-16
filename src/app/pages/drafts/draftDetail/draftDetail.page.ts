import { Component, OnInit } from "@angular/core";
import {
  ToastController,
  ModalController,
  LoadingController,
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: "app-draftdetail",
  templateUrl: "./draftDetail.page.html",
  styleUrls: ["./draftDetail.page.scss"],
})
export class DraftDetailPage implements OnInit {
  index;
  draft: any;
  disableButton = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    public modalController: ModalController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get("id");
    // this.orderService.getOrderDraft(this.index).then(draft => {
    //   this.draft = draft;
    // });

    this.draft = this.orderService.getOrderDraft(this.index);
  }

  delete() {
    // this.orderService.deleteOrderDraft(this.index).then(msg => {
    //   this.toDashboard(msg);
    // });
    this.orderService.deleteOrderDraft(this.index);
    this.toDashboard("Cotizacion Eliminada");
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
    const output = this.orderService.formatOrder(this.draft);

    const loading = await this.loadingController.create({
      message: "Guardando Orden...",
    });
    await loading.present();
    this.http
      .post(environment.apiSAP + "/order", output)
      .toPromise()
      .then((value) => {
        this.orderService.deleteOrderDraft(this.index);
        this.toDashboard("Pedido Guardado Con Exito.");
      })
      .catch(async (error) => {
        if (error.status == 409) {
          const reason = error.error.map((e) => e.AUTH).join(" ");
          const outputCRM = this.orderService.formatOrderCRMAuth(
            this.draft,
            reason,
            1
          );
          await this.http
            .post(environment.apiCRM + "/orderSAP", outputCRM)
            .toPromise()
            .then((data) => {
              this.orderService.deleteOrderDraft(this.index);
              this.toDashboard(
                "Pedido Guardado. Esperando Autorizacion." + reason
              );
            })
            .catch((error) => {
              console.error(error);
              this.presentToast(error);
            });
        } else {
          this.presentToast(error.error.error);
          console.error(error);
        }
      })
      .finally(() => {
        this.disableButton = false;
        loading.dismiss();
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
