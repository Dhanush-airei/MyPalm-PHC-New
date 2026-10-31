import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAssignPageRoutingModule } from './maintenance-assign-routing.module';

import { MaintenanceAssignPage } from './maintenance-assign.page';

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
    MaintenanceAssignPageRoutingModule,
  ],
  declarations: [MaintenanceAssignPage],
})
export class MaintenanceAssignPageModule {}
