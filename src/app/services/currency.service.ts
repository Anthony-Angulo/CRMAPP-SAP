import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const CURRENCY_KEY = "CurrencyRate";

@Injectable({
  providedIn: "root",
})
export class CurrencyRateService {
  _SAP_IP: any;
  constructor(private storage: Storage, private http: HttpClient) {}

  async getDataFromDatabase(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/CurrencyRate`)
      .toPromise()
      .then((data: any) => {
        this.setCurrencyRate(Number(data.CurrencyRate));
      })
      .catch((error) => {
        if (error.status == 404 && error.error == "Update the exchange rate") {
          throw Error("No se ha actualizado la moneda del dia de hoy.");
        }
        throw Error(error);
      });
  }

  getCurrencyRate(): Promise<number> {
    return this.storage.get(CURRENCY_KEY);
  }

  setCurrencyRate(currencyRate): void {
    this.storage.set(CURRENCY_KEY, currencyRate);
  }
}
