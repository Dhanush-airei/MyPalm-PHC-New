import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceUploadImagePopupPageRoutingModule } from './maintenance-upload-image-popup-routing.module';

import { MaintenanceUploadImagePopupPage } from './maintenance-upload-image-popup.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaintenanceUploadImagePopupPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenanceUploadImagePopupPage],
})
export class MaintenanceUploadImagePopupPageModule {}
