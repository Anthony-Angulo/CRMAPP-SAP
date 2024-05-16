import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { OrderListPage } from "./orderList.page";
import { OrderListAuth } from "./OrderListAuth/orderListAuth.page";
import { OrderListPageSAP } from "./OrderList/orderListSAP.page";
const routes: Routes = [
  {
    path: "",
    component: OrderListPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OrderListPage, OrderListAuth, OrderListPageSAP],
})
export class OrderListPageModule {}
