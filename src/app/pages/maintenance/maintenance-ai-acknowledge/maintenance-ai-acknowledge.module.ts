import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiAcknowledgePageRoutingModule } from './maintenance-ai-acknowledge-routing.module';

import { MaintenanceAiAcknowledgePage } from './maintenance-ai-acknowledge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceAiAcknowledgePageRoutingModule
  ],
  declarations: [MaintenanceAiAcknowledgePage]
})
export class MaintenanceAiAcknowledgePageModule {}
