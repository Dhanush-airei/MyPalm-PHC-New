import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionFfbCageMillStartPageRoutingModule } from './production-ffb-cage-mill-start-routing.module';

import { ProductionFfbCageMillStartPage } from './production-ffb-cage-mill-start.page';

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
    ProductionFfbCageMillStartPageRoutingModule,
  ],
  declarations: [ProductionFfbCageMillStartPage],
})
export class ProductionFfbCageMillStartPageModule {}
