import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionHourlyPressStationPageRoutingModule } from './production-hourly-press-station-routing.module';

import { ProductionHourlyPressStationPage } from './production-hourly-press-station.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionHourlyPressStationPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ProductionHourlyPressStationPage],
})
export class ProductionHourlyPressStationPageModule {}
