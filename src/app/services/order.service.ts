import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { environment } from "src/environments/environment";
import { UserService } from "../account/services/user.service";

const ORDERS_KEY = "Orders";
const PENDING_ORDERS_KEY = "PendingOrders";
const ORDER_DRAFTS_KEY = "OrderDrafts";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  draftList = [];
  _SAP_IP: any;

  constructor(
    private storage: Storage,
    private userService: UserService,
    private http: HttpClient
  ) {
    console.log("OrderServiceContructor");
    this.storage.get(ORDER_DRAFTS_KEY).then((draftList) => {
      if (draftList) {
        this.draftList = draftList;
      }
    });
  }

  ngOnDestroy() {
    console.log("OrderService destroy");
    this.storage.set(ORDER_DRAFTS_KEY, this.draftList);
  }

  async getDataFromDatabase(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.userService
      .getUser()
      .then((user) => {
        if (user.AppLogin.id != 0) {
          const date = new Date();
          return this.http
            .get(`${this._SAP_IP}/order/CRMAPP/listTag/${user.AppLogin.id}`)
            .toPromise();
        } else {
          return this.http
            .get(`${this._SAP_IP}/order/CRMAPP/list/`)
            .toPromise()
            .then((data) => {
              return data;
            });
          this.setOrders([]);
          throw Error("No Tiene numero de SAP asignado.");
        }
      })
      .then((data: any) => {
        const filtrado = data.filter((order) => order.DocEntry != 0);
        const orders = filtrado;
        /*    orders.forEach(order => {
            console.log(order)
        order.Detail = data.filter(row => row.DocEntry == order.DocEntry)
      });*/
        this.setOrders(orders);
      });
  }
  async getAuth(): Promise<any> {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    return this.userService
      .getUser()
      .then((user) => {
        if (user.AppLogin.id != 0) {
          const date = new Date();
          return this.http
            .get(`${this._SAP_IP}/OrdersAuth/GetByUser/${user.AppLogin.id}`)
            .toPromise()
            .then((data) => {
              return data;
            });
        } else {
          return this.http
            .get(`${this._SAP_IP}/order/CRMAPP/list/`)
            .toPromise()
            .then((data) => {
              return data;
            });
          this.setOrders([]);
          throw Error("No Tiene numero de SAP asignado.");
        }
      })
      .then((data: any) => {});
  }
  async getOrder(index) {
    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));
    var orderReturn;
    await this.userService.getUser().then(async (user) => {
      await this.http
        .get(`${this._SAP_IP}/order/${index}`)
        .toPromise()
        .then((datos: any) => {
          orderReturn = {
            PeyMethod: datos.ORDR.PymntGroup,
            DocCur: datos.ORDR.DocCur,
            DocDate: datos.ORDR.DocDate,

            DocStatus: datos.ORDR.DocStatus,
            DocDueDate: datos.ORDR.DocDueDate,
            Detail: datos.RDR1,
            CardName: datos.ORDR.CardName,
            Address: datos.ORDR.Address,
            DocTotal: datos.ORDR.DocTotal,
            DocTotalFC: datos.ORDR.DocTotalFC,
            CardFName: datos.ORDR.CardFName,
            Estatus: datos.ORDR.Estatus,
            U_FECHAREG_PEDIDO: datos.ORDR.U_FECHAREG_PEDIDO,
            U_HORAREG_PEDIDO: datos.ORDR.U_HORAREG_PEDIDO,
          };
        });
    });
    return orderReturn;
  }

  getOrders(): Promise<any[]> {
    return this.storage.get(ORDERS_KEY);
  }

  setOrders(orders): void {
    this.storage.set(ORDERS_KEY, orders);
  }

  formatOrder(order) {
    return {
      vendedor: order.vendedor,
      cardcode: order.contact.CardCode,
      currency: order.currency,
      total: order.total,
      payment:
        order.payment.GroupNum == "-2"
          ? order.contact.GroupNum
          : order.payment.GroupNum,
      comments: order.comments,
      series: order.warehouse.Series,
      date: order.date,
      currencyrate: order.currencyRate,
      pricelist: order.priceList,
      idusuario: order.idusuario,
      IdUserCreated: order.idusuario,
      identificador: order.identificador,
      auth: 0,
      rows: order.products.map((product) => {
        var currencyNew =
          product.seletedCurrency != undefined
            ? product.seletedCurrency
            : product.seletedPriceList.Currency;
        console.log(product.seletedPriceList.Currency);
        return {
          quantity: product.Quantity,
          code: product.product.ItemCode,
          uom: product.seletedUM.UomEntry,
          equivalentePV: product.seletedUM.BaseQty,
          currency:
            product.seletedCurrency != undefined
              ? product.seletedCurrency
              : product.seletedPriceList.Currency,
          SelectedCurrency: currencyNew,
          meet: product.product.Meet,
        };
      }),
    };
  }

  formatOrderCRMAuth(order, reason, id) {
    console.log(order.products);
    return {
      id: order.id,
      vendedor: order.vendedor,
      cardcode: order.contact.CardCode,
      currency: order.currency,
      payment:
        order.payment.GroupNum == "-2"
          ? order.contact.GroupNum
          : order.payment.GroupNum,
      auth: 0,
      comments: order.comments + "`&" + order.idusuario,
      series: order.warehouse.Series,
      date: order.date,
      reason: reason,
      IdUserCreated: order.idusuario,
      currencyrate: order.currencyRate,
      cardname: order.contact.CardName,
      created_at: order.created_at,
      cardfname: order.contact.CardFName,
      pricelist: order.priceList,
      rows: order.products.map((product) => {
        var currencyNew =
          product.seletedCurrency != undefined
            ? product.seletedCurrency
            : product.seletedPriceList.Currency;

        return {
          ID: product.id,
          quantity: product.Quantity,
          code: product.product.ItemCode,
          uom: product.seletedUM.UomEntry,
          equivalentePV: product.seletedUM.BaseQty,
          Meet: product.product.Meet,
          SelectedCurrency: currencyNew,
        };
      }),
    };
  }
  formatOrderCRMAuthDetail(order, reason, id) {
    console.log(order);
    return {
      id: order.id,
      vendedor: order.vendedor,
      cardcode: order.contact.CardCode,
      currency: order.Currency,
      payment:
        order.payment.GroupNum == "-2"
          ? order.contact.GroupNum
          : order.payment.GroupNum,
      auth: 0,
      comments: order.Comments + "`&" + order.idusuario,
      series: order.warehouse.Series,
      date: order.Date,
      reason: order.Reason,
      IdUserCreated: order.idusuario,
      currencyrate: order.CurrencyRate,
      cardname: order.contact.CardName,
      created_at: order.created_at,
      cardfname: order.contact.CardFName,
      pricelist: order.PriceList,
      rows: order.products.map((product) => {
        var currencyNew =
          product.seletedCurrency != undefined
            ? product.seletedCurrency
            : product.seletedPriceList.Currency;

        return {
          ID: product.id,
          quantity: product.Quantity,
          code: product.ItemCode,
          uom: product.SelectedUOM.UomEntry,
          equivalentePV: product.SelectedUOM.BaseQty,
          Meet: product.Meet,
          SelectedCurrency: currencyNew,
        };
      }),
    };
  }
  // Pending Orders
  getPendingOrder(index): Promise<any> {
    return this.getPendingOrders().then((orderList) => {
      return orderList[index];
    });
  }

  getPendingOrders(): Promise<any[]> {
    return this.storage.get(PENDING_ORDERS_KEY);
  }

  setPendingOrders(orders): void {
    this.storage.set(PENDING_ORDERS_KEY, orders);
  }

  async addPendingOrders(order) {
    this.getPendingOrders().then((orders) => {
      if (orders) {
        orders.push(order);
        this.setPendingOrders(orders);
      } else {
        this.setPendingOrders([order]);
      }
    });
  }

  async deletePendingOrder(index) {
    return this.getPendingOrders().then((orders) => {
      orders.splice(index, 1);
      this.setPendingOrders(orders);
      return "Orden Pendiente Eliminada";
    });
  }

  // Order Draft

  // getOrderDraft(index): Promise<any> {
  //   return this.getOrderDrafts().then(draftList => {
  //     return draftList[index];
  //   });
  // }

  // getOrderDrafts(): Promise<any[]> {
  //   return this.storage.get(ORDER_DRAFTS_KEY);
  // }

  // setOrderDrafts(draft): void {
  //   this.storage.set(ORDER_DRAFTS_KEY, draft);
  // }

  // addOrderDrafts(draft): void {
  //   this.getOrderDrafts().then(drafts => {
  //     if (drafts) {
  //       drafts.push(draft);
  //       this.setOrderDrafts(drafts);
  //     } else {
  //       this.setOrderDrafts([draft]);
  //     }
  //   });
  // }

  // deleteOrderDraft(index) {
  //   return this.getPendingOrders().then(drafts => {
  //     drafts.splice(index, 1);
  //     this.setOrderDrafts(drafts);
  //     return 'Cotizacion Eliminada';
  //   })
  // }

  getOrderDraft(index) {
    return this.draftList[index];
  }

  getOrderDrafts() {
    return this.draftList;
  }

  setOrderDrafts(drafts): void {
    this.draftList = drafts;
  }

  addOrderDrafts(draft) {
    this.draftList.push(draft);
    // this.getOrderDrafts().then(drafts => {
    //   if (drafts) {
    //     drafts.push(draft);
    //     this.setOrderDrafts(drafts);
    //   } else {
    //     this.setOrderDrafts([draft]);
    //   }
    // });
  }

  deleteOrderDraft(index) {
    this.draftList.splice(index, 1);
    // return this.getPendingOrders().then(drafts => {
    //   drafts.splice(index, 1);
    //   this.setOrderDrafts(drafts);
    //   return 'Cotizacion Eliminada';
    // })
  }
}
