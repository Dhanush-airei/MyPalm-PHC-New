import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceRopmMultiPartSavePageRoutingModule } from './maintenance-ropm-multi-part-save-routing.module';

import { MaintenanceRopmMultiPartSavePage } from './maintenance-ropm-multi-part-save.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceRopmMultiPartSavePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenanceRopmMultiPartSavePage],
})
export class MaintenanceRopmMultiPartSavePageModule {}
