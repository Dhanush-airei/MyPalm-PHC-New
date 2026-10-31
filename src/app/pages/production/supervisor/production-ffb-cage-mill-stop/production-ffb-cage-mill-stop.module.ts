import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionFfbCageMillStopPageRoutingModule } from './production-ffb-cage-mill-stop-routing.module';

import { ProductionFfbCageMillStopPage } from './production-ffb-cage-mill-stop.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    IonicModule,
    ProductionFfbCageMillStopPageRoutingModule,
  ],
  declarations: [ProductionFfbCageMillStopPage],
})
export class ProductionFfbCageMillStopPageModule {}
