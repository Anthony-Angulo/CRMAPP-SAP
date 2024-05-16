import { Injectable } from '@angular/core';
import { ToastController,LoadingController } from '@ionic/angular';
import { WarehouseService } from '../services/warehouse.service';
import { PaymentTermsService } from '../services/payment.service';
import { CurrencyRateService } from '../services/currency.service';
import { ContactService } from '../services/contact.service';
import { ProductService } from '../services/product.service';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private contactService: ContactService,
        private productService: ProductService,
        private warehouseService: WarehouseService,
        private paymentTermsService: PaymentTermsService,
        private currencyService: CurrencyRateService,
        public toastController: ToastController,
        public loadingController: LoadingController,
        private storage: Storage,
    ) { }

    async getDatabaseinfo() {        
        var usuario= await this.storage.get("USER");
        if(usuario.AppLogin.Active_Burn==5){
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Obteniendo Datos...',
          });
        await loading.present();
        Promise.all([
            this.productService.getDataFromDatabase(),
            this.contactService.getDataFromDatabase(),
            this.warehouseService.getDataFromDatabase(),
            this.paymentTermsService.getDataFromDatabase(),
            this.currencyService.getDataFromDatabase(),
            this.paymentTermsService.getDataFromDatabasePriceList(),
        ]).then(() => {
            this.presentToast('Datos Actualizados Correctamente');
        }).catch(error => {
            // console.error(error);
            this.presentToast('Datos No Actualizados Correctamente. ' + error);
        }).finally(() => {
            loading.dismiss()
        })
    }

    presentToast(data: any) {
        this.toastController.create({
            message: data,
            duration: 1500
        }).then(toast => toast.present());
    }
}