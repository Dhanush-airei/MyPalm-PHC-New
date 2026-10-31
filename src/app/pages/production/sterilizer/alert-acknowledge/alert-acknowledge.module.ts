import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertAcknowledgePageRoutingModule } from './alert-acknowledge-routing.module';

import { AlertAcknowledgePage } from './alert-acknowledge.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertAcknowledgePageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [AlertAcknowledgePage],
})
export class AlertAcknowledgePageModule {}
