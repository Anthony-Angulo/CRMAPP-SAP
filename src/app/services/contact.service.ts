import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { promise } from "selenium-webdriver";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const CONTACTS_KEY = "Contacts";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  _SAP_IP: any;

  constructor(private storage: Storage, private http: HttpClient) {
    // this.storage.get("_SAP_IP").then((x) => {
    //   this._SAP_IP = x;
    //   console.log(this._SAP_IP);
    // });
  }

  async getDataFromDatabase(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/contact/appcrm`)
      .toPromise()
      .then((data: any) => {
        data.forEach((contact) => {
          if (!contact.CardFName) {
            contact.CardFName = "";
          }
        });
        this.setContacts(data);
      });
  }

  getContacts(): Promise<any[]> {
    return this.storage.get(CONTACTS_KEY);
  }

  setContacts(contacts): void {
    this.storage.set(CONTACTS_KEY, contacts);
  }

  async getProductos(CardCode): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/ProductosPreferidos/Productos/${CardCode}`)
      .toPromise()
      .then((data: any) => {
        data.forEach((contact) => {
          if (!contact.CardFName) {
            contact.CardFName = "";
          }
        });
      });
  }
}
