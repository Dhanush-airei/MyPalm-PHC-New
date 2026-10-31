import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionHourlySterilizerStationPageRoutingModule } from './production-hourly-sterilizer-station-routing.module';

import { ProductionHourlySterilizerStationPage } from './production-hourly-sterilizer-station.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionHourlySterilizerStationPageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [ProductionHourlySterilizerStationPage],
})
export class ProductionHourlySterilizerStationPageModule {}
