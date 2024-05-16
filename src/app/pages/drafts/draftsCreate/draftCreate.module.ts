import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DraftCreatePage } from './draftCreate.page';
import { ModalPage } from './productDetail/modal.component';

const routes: Routes = [
  {
    path: '',
    component: DraftCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DraftCreatePage, ModalPage],
  entryComponents: [ModalPage]
})
export class DraftCreatePageModule { }
