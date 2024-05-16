import { Component, OnInit } from "@angular/core";
import { Network } from "@ionic-native/network/ngx";
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { UserService } from "../account/services/user.service";
import { Storage } from "@ionic/storage";

import { ContactService } from "../services/contact.service";
import { CurrencyRateService } from "../services/currency.service";
import { PaymentTermsService } from "../services/payment.service";
import { ProductService } from "../services/product.service";
import { WarehouseService } from "../services/warehouse.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-menu-left",
  templateUrl: "./menu-left.component.html",
  styleUrls: ["./menu-left.component.scss"],
})
export class MenuLeftComponent implements OnInit {
  nombre;
  version;
  MostrarEnZero;
  SapIp;
  constructor(
    private productService: ProductService,
    private contactService: ContactService,
    private warehouseService: WarehouseService,
    private paymentTermsService: PaymentTermsService,
    private currencyService: CurrencyRateService,
    private alertCtrl: AlertController,
    private network: Network,
    private storage: Storage,
    public plt: Platform,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private userService: UserService,
    private appVersion: AppVersion
  ) {}
  ngOnInit(): void {
    this.userService.getUser().then((user) => {
      this.nombre = user.AppLogin.Name;
    });
    this.storage.get("ShowInZero").then((x) => {
      if (x == null) {
        this.MostrarEnZero = false;
      } else {
        this.MostrarEnZero = true;
      }
    });

    if (this.plt.is("cordova")) {
      this.appVersion
        .getVersionNumber()
        .then((version) => {
          this.version = version;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  MostrarZeroUpdate($event) {
    console.log($event.target.checked);
    this.MostrarEnZero = $event.target.checked;
    this.storage.set("ShowInZero", this.MostrarEnZero);
  }

  async updateAll() {
    if (!this.checkConectionStatus()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: "Obteniendo Datos...",
    });
    await loading.present();

    Promise.all([
      this.productService.getDataFromDatabase(),
      this.contactService.getDataFromDatabase(),
      this.warehouseService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabase(),
      this.currencyService.getDataFromDatabase(),
      this.paymentTermsService.getDataFromDatabasePriceList(),
    ])
      .then(() => {
        this.presentToast("Datos Actualizados Correctamente");
      })
      .catch((error) => {
        this.presentToast("Datos No Actualizados Correctamente. " + error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async updateContacts() {
    const loading = await this.loadingController.create({
      message: "Obteniendo Datos...",
    });
    await loading.present();
    this.contactService
      .getDataFromDatabase()
      .then(() => {
        this.presentToast("Contactos Actualizados Correctamente");
      })
      .catch((error) => {
        this.presentToast("Contactos No Actualizados Correctamente. " + error);
        console.error(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async updateProducts() {
    const loading = await this.loadingController.create({
      message: "Obteniendo Datos...",
    });
    await loading.present();
    this.productService
      .getDataFromDatabase()
      .then(() => {
        this.presentToast("Productos Actualizados Correctamente");
      })
      .catch((error) => {
        this.presentToast("Productos No Actualizados Correctamente. " + error);
        console.error(error);
      })
      .finally(() => {
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
