import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrectiveMaintenancePageRoutingModule } from './corrective-maintenance-routing.module';

import { CorrectiveMaintenancePage } from './corrective-maintenance.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorrectiveMaintenancePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [CorrectiveMaintenancePage],
})
export class CorrectiveMaintenancePageModule {}
