import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const WAREHOUSE_KEY = "Warehouse";

@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  _SAP_IP: any;
  constructor(
    private storage: Storage,
    private userService: UserService,
    private http: HttpClient
  ) {
    console.log("WarehouseServiceContructor");
  }

  async getDataFromDatabase(): Promise<any> {
    // if (user.AppLogin.SAPID != 0) {
    //   return this.http.get(`${environment.apiSAP}/warehouse/list/${user.AppLogin.SAPID}`,{headers}).toPromise();
    // } else {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/warehouse/list`)
      .toPromise()
      .then((data: any) => {
        this.setWarehouseList(data);
      });
  }

  getWarehouseList(): Promise<any[]> {
    return this.storage.get(WAREHOUSE_KEY);
  }

  setWarehouseList(warehouseList): void {
    this.storage.set(WAREHOUSE_KEY, warehouseList);
  }
}
