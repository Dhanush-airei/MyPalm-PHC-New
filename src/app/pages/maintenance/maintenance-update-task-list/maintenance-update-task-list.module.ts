import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceUpdateTaskListPageRoutingModule } from './maintenance-update-task-list-routing.module';

import { MaintenanceUpdateTaskListPage } from './maintenance-update-task-list.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceUpdateTaskListPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MaintenanceUpdateTaskListPage],
})
export class MaintenanceUpdateTaskListPageModule {}
