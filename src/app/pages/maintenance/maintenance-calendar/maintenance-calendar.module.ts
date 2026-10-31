import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceCalendarPageRoutingModule } from './maintenance-calendar-routing.module';

import { MaintenanceCalendarPage } from './maintenance-calendar.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    IonicModule,
    MaintenanceCalendarPageRoutingModule,
  ],
  declarations: [MaintenanceCalendarPage],
})
export class MaintenanceCalendarPageModule {}
