import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { environment as ENV, environment } from "src/environments/environment";

const USER_KEY = "USER";
const TOKEN_KEY = "TOKEN_KEY";
const ORDERS_KEY = "Orders";

@Injectable({
  providedIn: "root",
})
export class UserService {
  authenticationState = new BehaviorSubject(false);
  _SAP_IP;
  constructor(
    private platform: Platform,
    private http: HttpClient,
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.platform.ready().then((_) => {
      this.checkToken();
    });
  }

  async login(formData: any) {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    console.log(this._SAP_IP);
    if (this._SAP_IP != null) {
      console.log(1);
    } else if (
      this._SAP_IP == null &&
      environment.acceso.includes(formData.email)
    ) {
      console.log(2);
      await this.storage.set("_SAP_IP", environment.alestra_B);
    } else {
      console.log(3);
      await this.storage.set("_SAP_IP", environment.alestra_A);
    }

    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));

    const loading = await this.loadingController.create({
      message: `Conectando a ${this._SAP_IP}`,
    });
    await loading.present();

    this.http
      .post(this._SAP_IP + "/Account/login", formData)
      .toPromise()
      .then((data: any) => {
        console.log(data);
        if (data && data.token) {
          this.storage.set(USER_KEY, data);
          this.storage.set("last_user", formData.email);

          this.storage.set(TOKEN_KEY, data.token).then((res) => {
            this.authenticationState.next(true);
          });
        } else {
          this.presentAlert("Credenciales Invalidas.");
        }
      })
      .catch((err: any) => {
        console.log(err);
        this.presentAlert(`Error:${err.error}`);
        this.storage.set("_SAP_IP", undefined);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async presentAlert(info) {
    const alert = await this.alertController.create({
      header: "Login",
      message: info,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async logout(): Promise<void> {
    await this.storage.set(ORDERS_KEY, {});
    await this.storage.set("_SAP_IP", undefined);
    return this.storage.remove(TOKEN_KEY).then((_) => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated(): boolean {
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then((res) => {
      if (res) {
        this.authenticationState.next(true);
      } else {
        this.authenticationState.next(false);
      }
    });
  }

  getUser() {
    return this.storage.get(USER_KEY);
  }
}
