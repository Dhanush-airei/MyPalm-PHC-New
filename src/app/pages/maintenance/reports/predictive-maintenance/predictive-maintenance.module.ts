import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictiveMaintenancePageRoutingModule } from './predictive-maintenance-routing.module';

import { PredictiveMaintenancePage } from './predictive-maintenance.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredictiveMaintenancePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [PredictiveMaintenancePage],
})
export class PredictiveMaintenancePageModule {}
