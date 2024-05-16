import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
//import { stringify } from 'querystring';
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const PRODUCTS_KEY = "Products";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  _SAP_IP: any;
  constructor(
    private storage: Storage,
    private userService: UserService,
    private http: HttpClient
  ) {
    console.log("ProductServiceContructor");
  }

  async getDataFromDatabase(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.http
      .get(`${this._SAP_IP}/products/appcrm`)
      .toPromise()
      .then((data: any) => {
        const products = data.products;
        products.map((product) => {
          const uom = [];
          for (let j = 0; j < data.uom.length; j++) {
            if (
              data.uom[j].UgpCode == product.ItemCode &&
              data.uom[j].UomEntry != "486" &&
              data.uom[j].UomEntry != "487"
            ) {
              uom.push(data.uom[j]);
            }
          }
          product.uom = uom;

          const priceList = [];
          for (let j = 0; j < data.priceList.length; j++) {
            if (data.priceList[j].ItemCode == product.ItemCode) {
              priceList.push(data.priceList[j]);
            }
          }
          product.priceList = priceList;

          if (
            Number(product.U_IL_PesProm) != 0 &&
            product.uom.length == 1 &&
            product.uom[0].BaseUom == 485
          ) {
            const caja = {
              BASEUOM: "KG",
              BaseQty: Number(product.U_IL_PesProm),
              BaseUom: 485,
              UomCode: "Caja",
              UomEntry: "-2",
            };
            product.uom.push(caja);
            // console.log(caja)
          }

          const stocks = [];
          for (let j = 0; j < data.stock.length; j++) {
            if (data.stock[j].ItemCode == product.ItemCode) {
              stocks.push(data.stock[j]);
            }
          }
          product.stocks = stocks;
        });

        this.setProducts(products);
      });
  }

  getProducts(): Promise<any[]> {
    return this.storage.get(PRODUCTS_KEY);
  }

  setProducts(products): void {
    this.storage.set(PRODUCTS_KEY, products);
  }
}
