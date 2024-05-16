import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LogoutComponent } from './logout-button.component';

@NgModule({
  imports: [
  //   CommonModule,
  //   FormsModule,
    IonicModule,
  ],
  declarations: [LogoutComponent],
  exports: [LogoutComponent],
})
export class LogoutPageModule {}
