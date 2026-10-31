import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationFormHistoryModalPageRoutingModule } from './notification-form-history-modal-routing.module';

import { NotificationFormHistoryModalPage } from './notification-form-history-modal.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationFormHistoryModalPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [NotificationFormHistoryModalPage],
})
export class NotificationFormHistoryModalPageModule {}
