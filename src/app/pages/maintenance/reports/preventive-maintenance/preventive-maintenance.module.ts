import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreventiveMaintenancePageRoutingModule } from './preventive-maintenance-routing.module';

import { PreventiveMaintenancePage } from './preventive-maintenance.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreventiveMaintenancePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [PreventiveMaintenancePage],
})
export class PreventiveMaintenancePageModule {}
