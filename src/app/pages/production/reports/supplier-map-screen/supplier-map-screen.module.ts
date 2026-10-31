import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierMapScreenPageRoutingModule } from './supplier-map-screen-routing.module';

import { SupplierMapScreenPage } from './supplier-map-screen.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplierMapScreenPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [SupplierMapScreenPage],
})
export class SupplierMapScreenPageModule {}
