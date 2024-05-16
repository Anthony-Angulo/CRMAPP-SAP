import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment as ENV } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ContactService } from '../../../services/contact.service';
import { FilterByPipePipe } from '../../../pipes/filter-by-pipe.pipe';
import { ModalPage } from './productDetail/modal.component';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-draftcreate',
  templateUrl: './draftCreate.page.html',
  styleUrls: ['./draftCreate.page.scss'],
})
export class DraftCreatePage implements OnInit {
  @ViewChild('clientSearchBar', { static: true }) clientSearchBar: IonSearchbar;
  @ViewChild('productSearchBar', { static: true }) productSearchBar: IonSearchbar;

  contact;
  contactList = [];
  contactListSearchBar = [];

  products = [];
  productListAll = [];
  productListSearchBar = [];

  warehouseList = [];
  warehouse;

  paymentTermsList = [];
  paymentTerms = [];
  payment;

  comments = '';
  total = 0;
  totalDolares = 0;
  date = new Date((new Date()).setDate(new Date().getDate() + 1)).toISOString();
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 2, this.minDate.getMonth(), this.minDate.getDate());
  dateFormated;
  disableButton = false;
  tipoCambio: number;
  filterPipe: FilterByPipePipe;

  constructor(private router: Router,
              private http: HttpClient,
              private productService: ProductService,
              private contactService: ContactService,
              private orderService: OrderService,
              private storage: Storage,
              public toastController: ToastController,
              public modalController: ModalController,
              private loadingController: LoadingController) {
    this.filterPipe = new FilterByPipePipe();
  }

  ngOnInit() {

    Promise.all([
      this.contactService.getContacts(),
      this.productService.getProducts(),
      this.storage.get('Sucursales'),
      this.storage.get('PaymentTerms'),
      this.storage.get('CurrencyRate'),
    ]).then(([contactList, productListAll, warehouseList, paymentTerms, currencyRate]) => {
      this.paymentTermsList = paymentTerms;
      this.contactList = contactList;
      this.productListAll = productListAll; // .filter(pro => pro.PriceList.length !=0 );
      this.warehouseList = warehouseList;
      this.tipoCambio = currencyRate;
    }).catch(error => {
      console.error(error);
    });

  }

  public searchContacts(value) {
    if (value && value.trim() != '') {
      this.contactListSearchBar = this.filterPipe.transform(this.contactList, value);
    } else {
      this.contactListSearchBar = [];
    }
  }

  public searchProducts(value) {
    if (value && value.trim() != '') {
      this.productListSearchBar = this.filterPipe.transform(this.productListAll, value);
    } else {
      this.productListSearchBar = [];
    }
  }

  public addContact(contact: any) {
    this.contact = contact;
    this.contactListSearchBar = [];
    this.clientSearchBar.value = '';
    this.paymentTerms = this.paymentTermsList.filter(pay => pay.GroupNum == '-1' || pay.GroupNum == '2');
    if (this.contact.GroupNum != '-1' && this.contact.GroupNum != '2') {
      this.paymentTerms.push({GroupNum: -2, PymntGroup: 'Credito'});
    }
  }

  async presentModal(product) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'product': product,
        'tipoCambio': this.tipoCambio,
      }
    });
    modal.onDidDismiss().then(() => {
      this.updateTotal();
    });
    return await modal.present();
  }

  public addProduct(product: any) {

    if (!product.priceList[0].Currency || Number(product.priceList[0].Price) <= 0) {
      this.presentToast('Producto no tiene precio correcto');
      return;
    }

    const productOrder = {
      product,
      Quantity: 1,
      seletedUM: product.uom[0],
      seletedPriceList: product.priceList[0],
      stockSelected: product.stocks.find(stock => stock.WhsCode == this.warehouse.WhsCode),
    };

    this.products.unshift(productOrder);
    this.productListSearchBar = [];
    this.productSearchBar.value = '';
    this.updateTotal();

  }

  eliminarProducto(index) {
    this.products.splice(index, 1);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.products.map(product => {
      if (product.seletedPriceList.Currency == 'MXN') {
        return product.Quantity * product.seletedPriceList.Price * product.seletedUM.BaseQty;
      } else if (product.seletedPriceList.Currency == 'USD' && product.seletedCurrency == 'MXN') {
        return product.Quantity * product.seletedPriceList.Price * product.seletedUM.BaseQty * this.tipoCambio;
      }
      return 0;
    }).reduce((a, b) => a + b, 0);

    this.totalDolares = this.products
      .filter(product => product.seletedPriceList.Currency == 'USD' && product.seletedCurrency == 'USD')
      .map(product => {
        return product.Quantity * product.seletedPriceList.Price * product.seletedUM.BaseQty;
      }).reduce((a, b) => a + b, 0);

  }

  cambioSucursal(event) {
    this.products = [];
    this.productListAll.map(product => {
      product.stockSelected = product.stocks.find(stock => stock.WhsCode == this.warehouse.WhsCode);
    });
    this.updateTotal();
  }

  async entregaPedido() {

    this.dateFormated = this.date.split('T')[0].split('-').swap(0, 2).swap(0, 1).join('-');

    const loading = await this.loadingController.create({
      message: 'Guardando Cotizacion...',
    });
    await loading.present();

    const error = this.products.map(product => {
      if (!product.seletedPriceList.Price) {
        this.presentToast('Producto: ' + product.product.ItemCode + ' No tiene precio');
        return false;
      } else if (product.seletedPriceList.Currency == 'USD' && product.seletedCurrency == undefined) {
        this.presentToast('Producto: ' + product.product.ItemCode + ' No tiene Moneda Seleccionada');
        return false;
      }/* else if (!product.stock) {
        console.log('Producto:' + product.ItemCode + ' No tiene stock');
        return false;
      }*/
      return true;
    }).some(result => !result);

    if (error || !this.contact) {
      console.log('No se completo correctamente la orden');
      this.disableButton = false;
      loading.dismiss();
      return;
    }

    const productsDollar =
      this.products.filter(product => product.seletedPriceList.Currency == 'USD' && product.seletedCurrency == 'USD');

    const productsMXN =
      this.products.filter(product => product.seletedPriceList.Currency == 'MXN' || product.seletedCurrency == 'MXN');

      const messageH = (data) => {
        return 'Cotizacion Guardada Con Exito.';
      };

    let result;

    if (productsMXN.length > 0  && productsDollar.length > 0) {
      result = Promise.all([
        this.createDraft('MXN', productsMXN),
        this.createDraft('USD', productsDollar),
      ]).then(data => {
        return 'Cotizacion Guardada Con Exito.';
      });
    } else if (productsMXN.length > 0) {
      result = this.createDraft('MXN', productsMXN).then(messageH);
    } else if (productsDollar.length > 0) {
      result = this.createDraft('USD', productsDollar).then(messageH);
      }

      result.then((message) => {
        console.log(message);
        Swal.fire({
          title: message,
          type: 'success',
          confirmButtonText: 'Enterado.'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['dashboard']);
          }
        });
    }).catch(error => {
      this.presentToast(error);
      console.error(error);
    }).finally(() => {
      this.disableButton = false;
      loading.dismiss();
    });

  }

  createDraft(currency,  products) {
    const order = {
      contact: this.contact,
      currency,
      payment: this.payment,
      comments: this.comments,
      warehouse: this.warehouse,
      products,
      date: this.dateFormated,
    };
    this.orderService.addOrderDrafts(order);
    return Promise.resolve(true);
  }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data,
      duration: 5000
    });
    toast.present();
  }

}
