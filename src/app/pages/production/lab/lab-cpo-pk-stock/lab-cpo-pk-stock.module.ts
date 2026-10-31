import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabCpoPkStockPageRoutingModule } from './lab-cpo-pk-stock-routing.module';

import { LabCpoPkStockPage } from './lab-cpo-pk-stock.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabCpoPkStockPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [LabCpoPkStockPage],
})
export class LabCpoPkStockPageModule {}
