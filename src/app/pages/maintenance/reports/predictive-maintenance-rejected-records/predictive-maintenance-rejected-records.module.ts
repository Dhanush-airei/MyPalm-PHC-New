import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictiveMaintenanceRejectedRecordsPageRoutingModule } from './predictive-maintenance-rejected-records-routing.module';

import { PredictiveMaintenanceRejectedRecordsPage } from './predictive-maintenance-rejected-records.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredictiveMaintenanceRejectedRecordsPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [PredictiveMaintenanceRejectedRecordsPage],
})
export class PredictiveMaintenanceRejectedRecordsPageModule {}
