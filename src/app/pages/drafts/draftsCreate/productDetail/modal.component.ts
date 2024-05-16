import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  templateUrl: './modal.component.html'
})
export class ModalPage {

  @Input() product: any;
  @Input() tipoCambio: number;

  constructor (public modalCtrl: ModalController) { }

  changeUM(product, event) {
    product.seletedUM = product.product.uom.find(um => um.UomEntry == event);
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
  }

  productChange() {
    if (!Number.isInteger(this.product.Quantity)) {
      this.product.Quantity = Math.round(this.product.Quantity);
    }
  }

}
