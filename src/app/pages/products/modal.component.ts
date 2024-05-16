import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  templateUrl: './modal.component.html'
})
export class ModalPage {

  @Input() product: any;

  constructor (public modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
