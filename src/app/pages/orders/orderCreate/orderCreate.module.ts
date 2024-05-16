import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderCreatePage } from './orderCreate.page';
import { ModalPage } from './productDetail/modal.component';
import { ClientModal } from './ClientModal/ClientModal.page';
import { PipesModule } from '../../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: OrderCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [OrderCreatePage, ModalPage,ClientModal],
  entryComponents: [ModalPage,ClientModal]
})
export class OrderCreatePageModule { }
