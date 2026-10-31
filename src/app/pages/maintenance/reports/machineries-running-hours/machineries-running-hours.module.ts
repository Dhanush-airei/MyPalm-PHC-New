import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MachineriesRunningHoursPageRoutingModule } from './machineries-running-hours-routing.module';

import { MachineriesRunningHoursPage } from './machineries-running-hours.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MachineriesRunningHoursPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MachineriesRunningHoursPage],
})
export class MachineriesRunningHoursPageModule {}
