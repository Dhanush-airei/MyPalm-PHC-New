import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionFfbCagePageRoutingModule } from './production-ffb-cage-routing.module';

import { ProductionFfbCagePage } from './production-ffb-cage.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    ProductionFfbCagePageRoutingModule,
  ],
  declarations: [ProductionFfbCagePage],
})
export class ProductionFfbCagePageModule {}
