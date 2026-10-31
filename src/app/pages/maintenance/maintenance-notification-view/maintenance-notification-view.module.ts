import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceNotificationViewPageRoutingModule } from './maintenance-notification-view-routing.module';

import { MaintenanceNotificationViewPage } from './maintenance-notification-view.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    MaintenanceNotificationViewPageRoutingModule,
  ],
  declarations: [MaintenanceNotificationViewPage],
})
export class MaintenanceNotificationViewPageModule {}
