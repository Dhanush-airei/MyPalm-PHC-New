import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReplacementExtentedRunningHoursUpdatePageRoutingModule } from './replacement-extented-running-hours-update-routing.module';

import { ReplacementExtentedRunningHoursUpdatePage } from './replacement-extented-running-hours-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReplacementExtentedRunningHoursUpdatePageRoutingModule
  ],
  declarations: [ReplacementExtentedRunningHoursUpdatePage]
})
export class ReplacementExtentedRunningHoursUpdatePageModule {}
