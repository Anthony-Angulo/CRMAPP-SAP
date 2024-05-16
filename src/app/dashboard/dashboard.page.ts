import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Network } from "@ionic-native/network/ngx";
import { ContactService } from "../services/contact.service";
import { ProductService } from "../services/product.service";
import {
  AlertController,
  ToastController,
  LoadingController,
  Platform,
} from "@ionic/angular";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { WarehouseService } from "../services/warehouse.service";
import { PaymentTermsService } from "../services/payment.service";
import { CurrencyRateService } from "../services/currency.service";

const CHECK_IN = "CHECK_IN";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage {
  checkInStatus = false;
  private hubConnectionBuilder!: HubConnection;

  constructor(
    private network: Network,
    private contactService: ContactService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private paymentTermsService: PaymentTermsService,
    private currencyService: CurrencyRateService,
    private alertCtrl: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public plt: Platform,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.storage.get(CHECK_IN).then((val) => {
      if (val) {
      } else {
      }
    });
  }
  ngOnInit() {}
  checkIn() {
    this.storage.set(CHECK_IN, this.checkInStatus);
  }

  checkOut() {
    this.storage.set(CHECK_IN, this.checkInStatus);
  }

  logout() {
    this.checkOut();
  }
  /*
  async getDataOffline() {

    if (!this.checkConectionStatus()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos...',
    });
    await loading.present();
    Promise.all([
      this.productService.getDataFromDatabase(),
      this.contactService.getDataFromDatabase(),
      this.warehouseService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabase(),
      this.currencyService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabasePriceList(),
    ]).then(() => {
      console.log("datos")
      this.presentToast('Datos Actualizados Correctamente');
    }).catch(error => {
      // console.error(error);
      this.presentToast('Datos No Actualizados Correctamente. ' + error);
    }).finally(() => {
      loading.dismiss();
    });

  }*/ /*
  async updateAll() {

    if (!this.checkConectionStatus()) {
      return;
    }
    console.log("datos")

    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos...',
    });
    await loading.present();

    Promise.all([
      this.productService.getDataFromDatabase(),
      this.contactService.getDataFromDatabase(),
      this.warehouseService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabase(),
      this.currencyService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabasePriceList(),
    ]).then(() => {
      this.presentToast('Datos Actualizados Correctamente');
    }).catch(error => {
      this.presentToast('Datos No Actualizados Correctamente. ' + error);
    }).finally(() => {
      loading.dismiss();
    });

  }
*/
  presentToast(data: any) {
    this.toastController
      .create({
        message: data,
        duration: 5000,
      })
      .then((toast) => toast.present());
  }

  checkConectionStatus() {
    if (this.plt.is("cordova") && this.network.type == "none") {
      this.alertCtrl
        .create({
          header: "No Internet",
          message:
            "No se puede actualizar la informacion por falta de conexion a internet",
          buttons: ["OK"],
        })
        .then((alert) => alert.present());
      return false;
    }
    return true;
  }
}
