import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const PAYMENT_KEY = "PaymentTerms";
const PRICELIST_KEY = "PriceList";

@Injectable({
  providedIn: "root",
})
export class PaymentTermsService {
  _SAP_IP: any;
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private userService: UserService
  ) {
    console.log("PaymentServiceContructor");
  }

  async getDataFromDatabase(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/PaymentTerms/List`)
      .toPromise()
      .then((data: any) => {
        data = data.sort((payment1, payment2) => {
          return payment2.PymntGroup > payment1.PymntGroup ? -1 : 1;
        });
        this.setPaymentTerms(data);
      });
  }
  async getDataFromDatabasePriceList(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/pricelist/CRMList`)
      .toPromise()
      .then((data: any) => {
        this.storage.set(PRICELIST_KEY, data);
      });
  }

  getPaymentTerms(): Promise<any[]> {
    return this.storage.get(PAYMENT_KEY);
  }

  getPriceList(): Promise<any[]> {
    return this.storage.get(PRICELIST_KEY);
  }

  setPaymentTerms(paymentList): void {
    this.storage.set(PAYMENT_KEY, paymentList);
  }
}
