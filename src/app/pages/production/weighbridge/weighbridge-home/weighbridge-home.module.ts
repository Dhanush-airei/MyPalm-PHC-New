import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeHomePageRoutingModule } from './weighbridge-home-routing.module';

import { WeighbridgeHomePage } from './weighbridge-home.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeighbridgeHomePageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [WeighbridgeHomePage],
})
export class WeighbridgeHomePageModule {}
