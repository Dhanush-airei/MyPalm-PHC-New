import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiRejectPageRoutingModule } from './maintenance-ai-reject-routing.module';

import { MaintenanceAiRejectPage } from './maintenance-ai-reject.page';

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
    MaintenanceAiRejectPageRoutingModule,
  ],
  declarations: [MaintenanceAiRejectPage],
})
export class MaintenanceAiRejectPageModule {}
