import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiAssignPageRoutingModule } from './maintenance-ai-assign-routing.module';

import { MaintenanceAiAssignPage } from './maintenance-ai-assign.page';

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
    MaintenanceAiAssignPageRoutingModule,
  ],
  declarations: [MaintenanceAiAssignPage],
})
export class MaintenanceAiAssignPageModule {}
