import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionHourlyPressStationSavePageRoutingModule } from './production-hourly-press-station-save-routing.module';

import { ProductionHourlyPressStationSavePage } from './production-hourly-press-station-save.page';

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
    ProductionHourlyPressStationSavePageRoutingModule,
  ],
  declarations: [ProductionHourlyPressStationSavePage],
})
export class ProductionHourlyPressStationSavePageModule {}
