import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  templateUrl: './modal.component.html'
})
export class ModalPage {

  @Input() product: any;
  @Input() currencyRate: number;
  @Output() CambioProductoEmmiter = new EventEmitter();

  constructor (public modalCtrl: ModalController) { }

  changeUM(product, event) {
    this.CambioProductoEmmiter.emit();

    product.seletedUM = product.product.uom.find(um => um.UomEntry == event);
    this.CambioProductoEmmiter.emit();

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  public increment(product) {
    product.Quantity++;
    this.productChange();
  }

  public decrement(product) {
    if (product.Quantity > 1) {
      product.Quantity--;
      this.productChange();
    }
  }

  productQuantity(product) {
    if (product.Quantity <= 0) {
      product.Quantity = 1;
    }
    this.CambioProductoEmmiter.emit();

  }

  productChange() {
    if (!Number.isInteger(this.product.Quantity)) {
      this.product.Quantity = Math.round(this.product.Quantity);
      this.CambioProductoEmmiter.emit();

    }
  }

}
