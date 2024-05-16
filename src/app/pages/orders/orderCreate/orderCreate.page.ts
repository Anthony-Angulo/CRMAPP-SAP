import { HttpClient } from "@angular/common/http";
import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Network } from "@ionic-native/network/ngx";
import {
  AlertController,
  IonSearchbar,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { UserService } from "src/app/account/services/user.service";
import { CurrencyRateService } from "src/app/services/currency.service";
import { OrderService } from "src/app/services/order.service";
import { PaymentTermsService } from "src/app/services/payment.service";
import { ProductService } from "src/app/services/product.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import { environment as ENV } from "src/environments/environment";
import Swal from "sweetalert2";
import { Storage } from "@ionic/storage";

import { FilterByPipePipe } from "../../../pipes/filter-by-pipe.pipe";
import { ContactService } from "../../../services/contact.service";
import { ModalPage } from "./productDetail/modal.component";
import { ClientModal } from "./ClientModal/ClientModal.page";

@Component({
  selector: "app-ordercreate",
  templateUrl: "./orderCreate.page.html",
  styleUrls: ["./orderCreate.page.scss"],
})
export class OrderCreatePage implements OnInit {
  @ViewChild("clientSearchBar", { static: true }) clientSearchBar: IonSearchbar;
  @ViewChild("productSearchBar", { static: true })
  productSearchBar: IonSearchbar;
  contact;
  contactList = [];
  contactListSearchBar = [];
  priceListSelected = "";
  priceList = [];
  _SAP_IP: any;
  products = [];
  productListAll = [];
  productListSearchBar = [];

  warehouse;
  warehouseList = [];

  payment;
  paymentTermsList = [];
  paymentTerms = [];

  comments = "";
  total = 0;
  totalUSD = 0;

  Guardados = 0;
  ProductosGuardados: any[];
  minDate = new Date();
  maxDate = this.minDate.addYears(2);
  date = this.minDate.addDays(1).toISOString();
  idusuario;
  dateFormated;

  disableButton = false;
  currencyRate: number;

  filterPipe: FilterByPipePipe;
  vendedor: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private productService: ProductService,
    private contactService: ContactService,
    private orderService: OrderService,
    private warehouseService: WarehouseService,
    private paymentService: PaymentTermsService,
    private currencyService: CurrencyRateService,
    private navCtrl: NavController,
    private storage: Storage,
    //private network: Network,
    private alertCtrl: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private userService: UserService
  ) {
    this.filterPipe = new FilterByPipePipe();
  }
  load: any;

  async Actualizar() {
    this.ProductosGuardados = this.products;
    await this.storage.set("ProductosGuardados", this.ProductosGuardados);
  }
  MostrarEnZero = true;
  CargarLoading() {}
  async ngOnInit() {
    this.CargarLoading();
    this.storage.get("ShowInZero").then((x) => {
      this.MostrarEnZero = x;
    });

    await this.storage.get("_SAP_IP").then((x) => (this._SAP_IP = x));

    this.load = await this.loadingController.create({
      message: "Obteniendo Informacion",
    });
    await this.load.present();

    this.ProductosGuardados = await this.storage.get("ProductosGuardados");
    console.log(this.ProductosGuardados);
    if (this.ProductosGuardados != null) {
      this.Guardados = this.ProductosGuardados.length;
    } else {
      this.ProductosGuardados = [];
      this.Guardados = 0;
    }
    var Id;
    this.userService.getUser().then((user) => {
      this.idusuario = user.AppLogin.id;
      this.vendedor = user.AppLogin.SAPID;

      Id = user.AppLogin.Active_Burn;
    });
    if (Id == 5) {
      return;
    }
    Promise.all([
      this.contactService.getContacts(),
      this.productService.getProducts(),
      this.warehouseService.getWarehouseList(),
      this.paymentService.getPaymentTerms(),
      this.currencyService.getCurrencyRate(),
      this.paymentService.getPriceList(),
    ])
      .then(
        ([
          contactList,
          productListAll,
          warehouseList,
          paymentTerms,
          currencyRate,
          priceList,
        ]) => {
          this.paymentTermsList = paymentTerms;
          this.contactList = contactList;
          this.productListAll = productListAll; // .filter(pro => pro.PriceList.length !=0 );
          this.warehouseList = warehouseList;
          this.currencyRate = currencyRate;
          this.priceList = priceList;
          this.load.dismiss();
        }
      )
      .catch((error) => {
        console.error(error);
      });
  }

  public searchContacts(value) {
    if (value && value.trim() != "") {
      this.contactListSearchBar = this.filterPipe.transform(
        this.contactList,
        value
      );
    } else {
      this.contactListSearchBar = [];
    }
  }
  ProductosConStock;
  public searchProducts(value) {
    if (value && value.trim() != "") {
      this.ProductosConStock = this.productListAll.filter(
        (x) => x.stockSelected != undefined
      );
      console.log(this.MostrarEnZero);
      if (this.MostrarEnZero) {
        this.productListSearchBar = this.productListAll.filter(
          (x) =>
            x.ItemName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            x.ItemCode.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      } else {
        this.productListSearchBar = this.ProductosConStock.filter(
          (x) =>
            (x.ItemName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
              x.ItemCode.toLowerCase().indexOf(value.toLowerCase()) > -1) &&
            x.stockSelected.OnHand > 0
        );
      }
      console.log(this.productListAll[1]);
    } else {
      this.productListSearchBar = [];
    }
  }

  public addContact(contact: any) {
    this.contact = contact;
    this.contactListSearchBar = [];
    this.products = [];
    this.clientSearchBar.value = "";
    this.paymentTerms = this.paymentTermsList.filter(
      (pay) => pay.GroupNum == 2 || pay.GroupNum == 11
    );
    if (this.contact.GroupNum != 2 && this.contact.GroupNum != 11) {
      this.paymentTerms.push({ GroupNum: -2, PymntGroup: "Credito" });
    }

    this.priceListSelected = this.priceList.find(
      (pl) => pl.ListNum == this.contact.ListNum
    ).ListName;
  }

  async presentModal(product) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        product: product,
        currencyRate: this.currencyRate,
      },
    });
    modal.onDidDismiss().then(() => {
      this.storage.set("ProductosGuardados", this.products);
      this.updateTotal();
    });
    return await modal.present();
  }
  async ModalClientes(client) {
    const modal = await this.modalController.create({
      component: ClientModal,
      componentProps: {
        client: client,
      },
    });
    modal.onDidDismiss().then(() => {
      this.updateTotal();
    });
    return await modal.present();
  }
  public async restart() {
    this.ProductosGuardados = [];
    this.storage.set("ProductosGuardados", this.ProductosGuardados);

    await this.navCtrl.pop();
    await this.router.navigateByUrl("/orderCreate");
  }
  public async addProduct(product: any) {
    console.log("Productos agregados");
    console.log(this.products);
    let ProductoInserto = this.products.find(
      (x) => x.product.ItemCode == product.ItemCode
    );
    let Agregar = true;
    console.log(product);
    if (ProductoInserto != undefined) {
      await Swal.fire({
        title: `Producto ${ProductoInserto.product.ItemCode} ya existe en el listado de productos, Agregarlo a orden?`,
        type: "info",
        confirmButtonText: "Si.",
        cancelButtonText: "No",
        showCancelButton: true,
      }).then((result) => {
        if (result.value == undefined) {
          Agregar = false;
        }
      });
    }
    if (!Agregar) {
      this.productListSearchBar = [];
      this.productSearchBar.value = "";
      return;
    }
    const priceList = product.priceList.find(
      (pl) => pl.PriceList == this.contact.ListNum
    );
    // const priceList = product.priceList.find(pl => pl.PriceList == 2);
    if (!priceList || !priceList.Currency || Number(priceList.Price) <= 0) {
      this.presentToast("Producto no tiene precio correcto");
      return;
    }

    const productOrder = {
      product,
      Quantity: 1,
      seletedUM: product.uom[0],
      seletedPriceList: priceList,
      stockSelected: product.stocks.find(
        (stock) => stock.WhsCode == this.warehouse.WhsCode
      ),
    };
    this.products.unshift(productOrder);
    console.log(this.products);
    this.productListSearchBar = [];
    this.productSearchBar.value = "";
    this.storage.set("ProductosGuardados", this.products);
  }
  GuardarProducto(productOrder: any) {
    this.ProductosGuardados.unshift(productOrder);
  }
  eliminarProducto(index) {
    this.products.splice(index, 1);
    this.storage.set("ProductosGuardados", this.products);
    this.updateTotal();
  }
  async AddProductsFromList() {
    const loading = await this.loadingController.create({
      message: "Agregando productos seleccionados",
    });
    await loading.present();

    console.log("Agregando");
    console.log(this.productsToAdd.length);
    if (this.productsToAdd.length > 0) {
      console.log(this.productsToAdd);
      this.productsToAdd.forEach((element) => {
        console.log(element);
        this.addProduct(element);
        element.checked = false;
      });
    }
    await loading.dismiss();
    this.productsToAdd = [];
  }
  productsToAdd = [];
  Added(product, event) {
    if (event.target.checked) {
      this.productsToAdd.push(product);
    } else {
      this.productsToAdd = this.productsToAdd.filter(
        (xx) => xx.ItemCode != product.ItemCode
      );
    }
    product.checked = event.target.checked;
  }
  AgregarGuardados() {
    this.ProductosGuardados.map((x: any) => {
      const priceList = x.product.priceList.find(
        (pl) => pl.PriceList == this.contact.ListNum
      );
      // const priceList = product.priceList.find(pl => pl.PriceList == 2);
      if (!priceList || !priceList.Currency || Number(priceList.Price) <= 0) {
        this.presentToast("Producto no tiene precio correcto");
        return;
      }

      var productOrder = {
        product: x.product,
        Quantity: x.Quantity,
        seletedUM: x.seletedUM,
        seletedPriceList: priceList,
        stockSelected: x.product.stocks.find(
          (stock) => stock.WhsCode == this.warehouse.WhsCode
        ),
        seletedCurrency: "",
      };
      if (x.seletedCurrency != undefined) {
        productOrder.seletedCurrency = x.seletedCurrency;
      }
      this.products.push(productOrder);
    });
    this.ProductosGuardados = [];
    this.Guardados = 0;
    this.storage.set("ProductosGuardados", this.ProductosGuardados);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.products
      .map((product) => {
        if (product.seletedPriceList.Currency == "MXN") {
          return (
            product.Quantity *
            product.seletedPriceList.Price *
            product.seletedUM.BaseQty
          );
        } else if (
          product.seletedPriceList.Currency == "USD" &&
          product.seletedCurrency == "MXN"
        ) {
          return (
            product.Quantity *
            product.seletedPriceList.Price *
            product.seletedUM.BaseQty *
            this.currencyRate
          );
        }
        return 0;
      })
      .reduce((a, b) => a + b, 0);

    this.totalUSD = this.products
      .filter(
        (product) =>
          product.seletedPriceList.Currency == "USD" &&
          product.seletedCurrency == "USD"
      )
      .map((product) => {
        return (
          product.Quantity *
          product.seletedPriceList.Price *
          product.seletedUM.BaseQty
        );
      })
      .reduce((a, b) => a + b, 0);
  }

  cambioSucursal(event) {
    this.products = [];
    // console.log()
    this.productListAll.map((product) => {
      product.stockSelected = product.stocks.find(
        (stock) => stock.WhsCode == this.warehouse.WhsCode
      );
    });
    this.updateTotal();
  }

  validateProducts() {
    return this.products
      .map((product) => {
        if (!product.seletedPriceList.Price) {
          this.presentToast(
            "Producto: " + product.product.ItemCode + " No tiene precio"
          );
          return false;
        } else if (
          product.seletedPriceList.Currency == "USD" &&
          product.seletedCurrency == undefined
        ) {
          this.presentToast(
            "Producto: " +
              product.product.ItemCode +
              " No tiene Moneda Seleccionada"
          );
          return false;
        } else if (product.Quantity <= 0) {
          console.log("Producto:" + product.ItemCode + " Cantidad Invalida");
          return false;
        }
        return true;
      })
      .includes(false);
  }
  Quantity = 0;

  async entregaPedido() {
    this.dateFormated = this.date
      .split("T")[0]
      .split("-")
      .swap(0, 2)
      .swap(0, 1)
      .join("-");

    const loading = await this.loadingController.create({
      message: "Guardando Orden...",
    });
    await loading.present();

    const error = this.validateProducts();

    if (error || !this.contact) {
      console.log("No se completo correctamente la orden");
      this.disableButton = false;
      loading.dismiss();
      return;
    }

    const productsFilterDollar = this.products.filter(
      (product) =>
        product.seletedPriceList.Currency == "USD" &&
        product.seletedCurrency == "USD"
    );

    const productsFilterMXN = this.products.filter(
      (product) =>
        product.seletedPriceList.Currency == "MXN" ||
        product.seletedCurrency == "MXN"
    );

    const orders: Promise<{ id: number; result: number; msg?: string }>[] = [];
    let returnCallback = (r) => {
      this.presentToast(`Error`);
    };
    let msg = "";

    if (this.warehouse.WhsCode == "S01") {
      const productsDollarMeet = productsFilterDollar.filter(
        (p) => p.product.Meet == "Y"
      );
      const productsDollar = productsFilterDollar.filter(
        (p) => p.product.Meet != "Y"
      );

      const productsMXNMeet = productsFilterMXN.filter(
        (p) => p.product.Meet == "Y"
      );
      const productsMXN = productsFilterMXN.filter(
        (p) => p.product.Meet != "Y"
      );
      if (productsDollarMeet.length > 0) this.Quantity += 1;
      if (productsDollar.length > 0) this.Quantity += 1;
      if (productsMXNMeet.length > 0) this.Quantity += 1;
      if (productsMXN.length > 0) this.Quantity += 1;
      var NumeroDeOrden = 0;
      const resultLabel = [{ Type: "", Currency: "" }];

      orders.push(this.createOrder("MXN", productsDollarMeet, NumeroDeOrden));

      returnCallback = (r) => {
        if (r.result == 1) {
          msg += `Orden de ${resultLabel[r.id].Type} En ${
            resultLabel[r.id].Currency
          } Agregada Correctamente\n`;
        } else if (r.result == 2 || r.result == 4) {
          msg += `Orden de ${resultLabel[r.id].Type} En ${
            resultLabel[r.id].Currency
          } En Almacenamiento Interno\n`;
        } else if (r.result == 3) {
          msg += `Orden de ${resultLabel[r.id].Type} En ${
            resultLabel[r.id].Currency
          } Esperando autorizacion\n`;
        }
      };
    } else {
      var NumeroDeOrden = 0;

      const resultLabel = [""];
      var NumeroDeOrden = 0;
      if (productsFilterDollar.length > 0) this.Quantity += 1;
      if (productsFilterMXN.length > 0) this.Quantity += 1;

      resultLabel[NumeroDeOrden] = "Pesos";
      orders.push(this.createOrder("MXN", productsFilterMXN, NumeroDeOrden));

      returnCallback = (r) => {
        if (r.result == 1) {
          msg += `Orden En ${resultLabel[r.id]} Agregada Correctamente\n`;
        } else if (r.result == 2 || r.result == 4) {
          msg += `Orden En ${resultLabel[r.id]} En Almacenamiento Interno\n`;
        } else if (r.result == 3) {
          msg += `Orden En ${resultLabel[r.id]} Esperando autorizacion\n`;
        }
      };
    }

    // Result 1 Success
    // Result 2 Error
    // Result 3 Auth
    // Result 4 No Conection
    Promise.all(orders)
      .then((data) => {
        const result = data.map((r) => r.result);

        if (result.every((c) => c == 4)) {
          msg = "Pedido Guardado En Almacenamiento. Esperando Conexion.";
        } else {
          data.forEach(returnCallback);
        }

        Swal.fire({
          title: msg,
          type: "success",
          confirmButtonText: "Enterado.",
        }).then((result) => {
          if (result.value) {
            this.ProductosGuardados = [];
            this.Guardados = 0;
            this.storage.set("ProductosGuardados", this.ProductosGuardados);
            this.router.navigate(["dashboard"]);
          }
        });
      })
      .catch((error) => {
        this.presentToast(error);
        console.error(error);
      })
      .finally(() => {
        this.disableButton = false;
        loading.dismiss();
      });
  }

  ProductsToAdd = [];
  onChange(item) {
    if (this.ProductsToAdd.includes(item)) {
      this.ProductsToAdd = this.ProductsToAdd.filter((value) => value != item);
    } else {
      this.ProductsToAdd.push(item);
    }
  }
  createOrder(
    currency,
    products,
    id
  ): Promise<{ id: number; result: number; msg?: string }> {
    let total = 0;
    this.products.forEach((x: any) => {
      console.log(x);
      if (x.seletedCurrency == "USD") {
        console.log("usd");
        console.log(x);
        total =
          total +
          x.seletedPriceList.Price *
            x.Quantity *
            x.seletedUM.BaseQty *
            this.currencyRate;
      } else {
        total =
          total + x.seletedPriceList.Price * x.Quantity * x.seletedUM.BaseQty;
        // console.log(total);
      }
    });
    const order = {
      contact: this.contact,
      currency,
      payment: this.payment,
      comments: this.comments,
      warehouse: this.warehouse,
      products: this.products,
      date: this.dateFormated,
      priceList: this.contact.ListNum,
      currencyRate: this.currencyRate,
      idusuario: this.idusuario,
      vendedor: this.vendedor,
      total: total,
    };
    console.log(this.products);
    const output = this.orderService.formatOrder(order);

    // if (this.network.type == 'none') {
    //   this.orderService.addPendingOrders(order);
    //   return Promise.resolve({id, result: 4});
    // }
    return this.http
      .post(this._SAP_IP + "/order/SeparateOrder", output)
      .toPromise()
      .then((value: any) => {
        return { id, result: 1 };
      })
      .catch(async (error) => {
        if (error.status == 200) {
          return { id, result: 1 };
        } else if (error.status == 409) {
          const reason = error.error.map((e) => e.AUTH).join(" ");
          const outputCRM = this.orderService.formatOrderCRMAuth(
            order,
            reason,
            `${id}/${this.Quantity}`
          );
          return await this.http
            .post(this._SAP_IP + "/OrdersAuth", outputCRM)
            .toPromise()
            .then((data) => {
              return { id, result: 3, msg: reason };
            })
            .catch((error) => {
              this.orderService.addPendingOrders(order);
              console.error(error);
              return { id, result: 2 };
            });
        }
        this.orderService.addPendingOrders(order);
        console.error(error);
        return { id, result: 2 };
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

  presentPrompt() {
    this.alertCtrl
      .create({
        header: "Tipo de Cambio",
        inputs: [
          {
            name: "CurrencyRate",
            value: this.currencyRate,
            type: "number",
          },
        ],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            handler: (data) => {
              console.log("Cancel clicked");
            },
          },
          {
            text: "Guardar",
            handler: (data) => {
              const currencyRate = Number(data.CurrencyRate);
              if (currencyRate <= 0) {
                this.presentToast("Parametro Invalido");
              } else {
                this.currencyRate = currencyRate;
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
