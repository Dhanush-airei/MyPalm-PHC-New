import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementProductionPageRoutingModule } from './management-production-routing.module';

import { ManagementProductionPage } from './management-production.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagementProductionPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [ManagementProductionPage],
})
export class ManagementProductionPageModule {}
