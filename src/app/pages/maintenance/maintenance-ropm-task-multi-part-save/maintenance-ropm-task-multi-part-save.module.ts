import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceRopmTaskMultiPartSavePageRoutingModule } from './maintenance-ropm-task-multi-part-save-routing.module';

import { MaintenanceRopmTaskMultiPartSavePage } from './maintenance-ropm-task-multi-part-save.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceRopmTaskMultiPartSavePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenanceRopmTaskMultiPartSavePage],
})
export class MaintenanceRopmTaskMultiPartSavePageModule {}
