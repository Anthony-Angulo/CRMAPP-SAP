import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Contact, PaymentTerm, Warehouse } from "src/app/core/models";
import { Location } from "@angular/common";
import { OrderService } from "src/app/services/order.service";
import { ProductService } from "src/app/services/product.service";
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";
import Swal from "sweetalert2";
enum Status {
  "O" = "Abierto",
  "C" = "Aprobada",
  "X" = "No_Aprobada",
  "M" = "Modificando",
  "V" = "Visualizando",
}
@Component({
  selector: "app-orderAuthDetail",
  templateUrl: "./orderAuthDetail.page.html",
  styleUrls: ["./orderAuthDetail.page.scss"],
})
export class orderAuthDetail implements OnInit {
  Status = Status;
  order: any;
  productListAll = [];
  _SAP_IP: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService,
    private storage: Storage,
    private location: Location
  ) {}
  products = [];
  obj;
  contact: Contact;
  warehouseSelected: Warehouse;
  paymentSelected: PaymentTerm;
  auth;
  index;
  newDate;
  async ngOnInit() {
    this.index = this.route.snapshot.paramMap.get("id");

    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));

    this.http
      .get(`${this._SAP_IP}/OrdersAuth/GetStatus/${this.index}`)
      .toPromise()
      .then((x: any) => {
        this.auth = x;
        this.GetData(this.index);
      });
  }
  NewStatus;
  private GetData(index: string) {
    console.log(this.auth);
    if (this.auth == 0) {
      this.NewStatus = 3;
    } else {
      this.NewStatus = this.auth;
    }
    console.log(this.NewStatus);
    this.http
      .get(`${this._SAP_IP}/OrdersAuth/UpdateStatus/${index}/${this.NewStatus}`)
      .toPromise()
      .then((x) => {
        Promise.all([
          this.http.get(`${this._SAP_IP}/warehouse/ListToSell`).toPromise(),
          this.productService.getProducts(),

          this.http.get(`${this._SAP_IP}/PaymentTerms/List`).toPromise(),
          this.http.get(`${this._SAP_IP}/OrdersAuth/${index}`).toPromise(),
        ])
          .then(
            ([warehouseList, productListAll, paymentTermList, data]: any[]) => {
              this.productListAll = productListAll; // .filter(pro => pro.PriceList.length !=0 );
              this.obj = data;
              this.paymentSelected = paymentTermList.find(
                (pm) => pm.GroupNum == data.order.Payment
              );
              this.warehouseSelected = warehouseList.find(
                (wh) => wh.Series == data.order.Series
              );
              let user = this.obj.order.Comments.split("`&");
              if (user.length > 1) {
                this.obj.order.idusuario = user[1];
              } else {
                this.obj.order.idusuario = 0;
              }
              this.obj.order.Comments = user[0];
              return this.http
                .get(
                  `${this._SAP_IP}/contact/CRMClientToSell/${data.order.CardCode}`
                )
                .toPromise();
            }
          )
          .then((data: Contact) => {
            this.contact = data;
            const ListNum = this.contact.ListNum;
            const WhsCode = this.warehouseSelected.WhsCode;

            const productPromises = this.obj.order.rows.map((product) => {
              return this.http
                .get(
                  `${this._SAP_IP}/products/CRMToSell/${product.Code}/${ListNum}/${WhsCode}`
                )
                .toPromise();
            });
            return Promise.all(productPromises);
          })
          .then((result: any[]) => {
            this.products = this.obj.order.rows.map((product, i) => {
              var prodList = this.productListAll.find(
                (x) => x.ItemCode == product.Code
              );
              const output: any = {
                Quantity: product.Quantity,
                ItemCode: product.Code,
                id: product.ID,
                ItemName: result[i].ItemName,
                SelectedUOM: result[i].UOMList.find(
                  (uom) => uom.UomEntry == product.Uom
                ),
                Price: result[i].Price,
                Currency: result[i].Currency,
                seletedCurrency: product.SelectedCurrency,
                UOMList: prodList.uom,
                PesoPromedio: result[i].PesProm,
              };
              output.code = product.Code;
              output.Uom = product.Uom.toString();
              output.EquivalentePV = product.EquivalentePV;
              output.Meet = result[i].Meet;
              if (output.SelectedUOM == undefined) {
                const caja = {
                  BaseCode: "KG",
                  BaseQty: product.EquivalentePV,
                  BaseUom: 185,
                  UomCode: "Caja",
                  UomEntry: "-2",
                };
                output.SelectedUOM = caja;
              }
              output.total =
                output.Quantity * output.SelectedUOM.BaseQty * output.Price;
              return output;
            });
          })
          .catch((error) => {})
          .finally(() => {
            this.order = this.obj.order;
            this.newDate = new Date(this.order.created_at);
            console.log(this.newDate);
            switch (this.order.Auth) {
              case "0":
                this.order.status = "O";
                break;
              case "1":
                this.order.status = "C";
                break;
              case "2":
                this.order.status = "X";
                break;
              case "3":
                this.order.status = "M";
                break;
              case "4":
                this.order.status = "V";
                break;
              default:
                break;
            }
          });
      });
  }

  changeUM(product, event) {
    product.SelectedUOM = product.UOMList.find((um) => um.UomEntry == event);
    product.Uom = product.SelectedUOM.UomEntry;
  }
  ChangeQuantity(product, event) {
    product.Quantity = event;
  }
  Save() {
    this.order.contact = this.contact;
    this.order.products = this.products;
    this.order.warehouse = this.warehouseSelected;
    this.order.payment = this.paymentSelected;
    const outputCRM = this.orderService.formatOrderCRMAuthDetail(
      this.order,
      "",
      ""
    );
    this.http
      .put(`${this._SAP_IP}/OrdersAuth/UpdateOrder`, outputCRM)
      .toPromise()
      .then((x) => {
        Swal.fire({
          title: "Actualizada correctamente",
          type: "success",
          confirmButtonText: "Ok.",
        }).then((result) => {
          if (result.value) {
            this.location.back();
          }
        });
      })
      .catch((x) => {
        Swal.fire({
          title: `Error al actualizar`,
          text: `status:${x.status} ${x.message}`,
          type: "error",
          confirmButtonText: "Ok.",
        }).then((result) => {});
      });
  }
  back() {
    this.http
      .get(
        `${this._SAP_IP}/OrdersAuth/UpdateStatus/${this.index}/${
          this.NewStatus == 3 ? "0" : this.NewStatus
        }`
      )
      .toPromise()
      .then((x) => {
        this.location.back();
      });
  }
}
