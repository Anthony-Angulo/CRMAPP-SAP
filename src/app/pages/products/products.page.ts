import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from './modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  productList = [];
  searchText = '';

  constructor(private productService: ProductService, public modalController: ModalController) { }

  ngOnInit() {
    this.productService.getProducts().then(productList => {
      this.productList = productList;
    });
  }

  async presentModal(product) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'product': product,
      }
    });
    return await modal.present();
  }
productwithstock(product:any){
  console.log(product);
  if (product.stocks.length ==0) {
    console.log('false');
    return false
  }
product.stocks.map(stock=>{
  if(stock.OnHand>1){
    return true;
  }}
  );
  return false;

}
}