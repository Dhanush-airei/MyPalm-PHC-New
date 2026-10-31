import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiAcceptMultiPartPageRoutingModule } from './maintenance-ai-accept-multi-part-routing.module';

import { MaintenanceAiAcceptMultiPartPage } from './maintenance-ai-accept-multi-part.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceAiAcceptMultiPartPageRoutingModule
  ],
  declarations: [MaintenanceAiAcceptMultiPartPage]
})
export class MaintenanceAiAcceptMultiPartPageModule {}
