import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionHourlyPressingStationUpdatePageRoutingModule } from './production-hourly-pressing-station-update-routing.module';

import { ProductionHourlyPressingStationUpdatePage } from './production-hourly-pressing-station-update.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionHourlyPressingStationUpdatePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ProductionHourlyPressingStationUpdatePage],
})
export class ProductionHourlyPressingStationUpdatePageModule {}
