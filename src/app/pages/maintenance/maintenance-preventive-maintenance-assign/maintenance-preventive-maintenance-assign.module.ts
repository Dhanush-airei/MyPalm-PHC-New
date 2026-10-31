import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancePreventiveMaintenanceAssignPageRoutingModule } from './maintenance-preventive-maintenance-assign-routing.module';

import { MaintenancePreventiveMaintenanceAssignPage } from './maintenance-preventive-maintenance-assign.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenancePreventiveMaintenanceAssignPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenancePreventiveMaintenanceAssignPage],
})
export class MaintenancePreventiveMaintenanceAssignPageModule {}
