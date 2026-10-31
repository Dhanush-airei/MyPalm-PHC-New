import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionBreakdownPageRoutingModule } from './production-breakdown-routing.module';

import { ProductionBreakdownPage } from './production-breakdown.page';

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
    ProductionBreakdownPageRoutingModule,
  ],
  declarations: [ProductionBreakdownPage],
})
export class ProductionBreakdownPageModule {}
