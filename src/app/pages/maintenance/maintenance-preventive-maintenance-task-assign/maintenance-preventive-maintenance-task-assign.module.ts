import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancePreventiveMaintenanceTaskAssignPageRoutingModule } from './maintenance-preventive-maintenance-task-assign-routing.module';

import { MaintenancePreventiveMaintenanceTaskAssignPage } from './maintenance-preventive-maintenance-task-assign.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenancePreventiveMaintenanceTaskAssignPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenancePreventiveMaintenanceTaskAssignPage],
})
export class MaintenancePreventiveMaintenanceTaskAssignPageModule {}
