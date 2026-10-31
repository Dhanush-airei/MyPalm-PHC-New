import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceDashboardPageRoutingModule } from './maintenance-dashboard-routing.module';

import { MaintenanceDashboardPage } from './maintenance-dashboard.page';

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
    MaintenanceDashboardPageRoutingModule,
  ],
  declarations: [MaintenanceDashboardPage],
})
export class MaintenanceDashboardPageModule {}
