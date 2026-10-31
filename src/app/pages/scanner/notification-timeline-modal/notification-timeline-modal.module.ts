import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationTimelineModalPageRoutingModule } from './notification-timeline-modal-routing.module';

import { NotificationTimelineModalPage } from './notification-timeline-modal.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationTimelineModalPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [NotificationTimelineModalPage],
})
export class NotificationTimelineModalPageModule {}
