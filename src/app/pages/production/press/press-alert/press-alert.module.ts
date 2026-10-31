import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PressAlertPageRoutingModule } from './press-alert-routing.module';

import { PressAlertPage } from './press-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PressAlertPageRoutingModule
  ],
  declarations: [PressAlertPage]
})
export class PressAlertPageModule {}
