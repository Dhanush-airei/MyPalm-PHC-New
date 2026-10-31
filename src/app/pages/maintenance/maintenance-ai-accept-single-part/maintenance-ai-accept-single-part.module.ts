import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiAcceptSinglePartPageRoutingModule } from './maintenance-ai-accept-single-part-routing.module';

import { MaintenanceAiAcceptSinglePartPage } from './maintenance-ai-accept-single-part.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceAiAcceptSinglePartPageRoutingModule
  ],
  declarations: [MaintenanceAiAcceptSinglePartPage]
})
export class MaintenanceAiAcceptSinglePartPageModule {}
