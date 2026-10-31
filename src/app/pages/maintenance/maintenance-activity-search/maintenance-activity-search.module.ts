import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceActivitySearchPageRoutingModule } from './maintenance-activity-search-routing.module';

import { MaintenanceActivitySearchPage } from './maintenance-activity-search.page';

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
    MaintenanceActivitySearchPageRoutingModule,
  ],
  declarations: [MaintenanceActivitySearchPage],
})
export class MaintenanceActivitySearchPageModule {}
