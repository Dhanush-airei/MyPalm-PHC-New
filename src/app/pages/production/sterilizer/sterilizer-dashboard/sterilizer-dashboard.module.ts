import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SterilizerDashboardPageRoutingModule } from './sterilizer-dashboard-routing.module';

import { SterilizerDashboardPage } from './sterilizer-dashboard.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SterilizerDashboardPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [SterilizerDashboardPage],
})
export class SterilizerDashboardPageModule {}
