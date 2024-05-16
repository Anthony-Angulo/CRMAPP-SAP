import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { OrderPendingDetailPage } from './orderPendingDetail.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPendingDetailPage
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
  declarations: [OrderPendingDetailPage]
})
export class OrderPendingDetailPageModule {}
