import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeUpdatePageRoutingModule } from './weighbridge-update-routing.module';

import { WeighbridgeUpdatePage } from './weighbridge-update.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WeighbridgeUpdatePageRoutingModule,
    TranslateModule,
  ],
  declarations: [WeighbridgeUpdatePage],
})
export class WeighbridgeUpdatePageModule {}
