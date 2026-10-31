import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiViewPageRoutingModule } from './maintenance-ai-view-routing.module';

import { MaintenanceAiViewPage } from './maintenance-ai-view.page';

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
    MaintenanceAiViewPageRoutingModule,
  ],
  declarations: [MaintenanceAiViewPage],
})
export class MaintenanceAiViewPageModule {}
