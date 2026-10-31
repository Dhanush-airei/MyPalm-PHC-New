import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceAiPageRoutingModule } from './maintenance-ai-routing.module';

import { MaintenanceAiPage } from './maintenance-ai.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { FilterPipe } from 'src/app/shared/pipes/filter-pipe';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilterPipe,
    TranslateModule,
    IonicModule,
    MaintenanceAiPageRoutingModule,
  ],
  declarations: [MaintenanceAiPage],
})
export class MaintenanceAiPageModule {}
