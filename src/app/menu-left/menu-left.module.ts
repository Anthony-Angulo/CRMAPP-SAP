import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuLeftComponent } from './menu-left.component';
import { UserService } from '../account/services/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MenuLeftComponent],
  exports: [MenuLeftComponent]
})
export class MenuLeftModule {}
