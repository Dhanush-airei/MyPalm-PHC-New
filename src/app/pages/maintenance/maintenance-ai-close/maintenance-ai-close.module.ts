import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiClosePageRoutingModule } from './maintenance-ai-close-routing.module';

import { MaintenanceAiClosePage } from './maintenance-ai-close.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceAiClosePageRoutingModule
  ],
  declarations: [MaintenanceAiClosePage]
})
export class MaintenanceAiClosePageModule {}
