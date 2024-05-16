import { NgModule } from "@angular/core";
import { LogoutPageModule } from "../account/logout/logout-button.module";

import { DashboardPage } from "./dashboard.page";
import { MenuLeftModule } from "../menu-left/menu-left.module";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

const routes: Routes = [
  {
    path: "",
    component: DashboardPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuLeftModule,
    LogoutPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
