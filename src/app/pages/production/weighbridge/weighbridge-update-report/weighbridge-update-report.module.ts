import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeUpdateReportPageRoutingModule } from './weighbridge-update-report-routing.module';

import { WeighbridgeUpdateReportPage } from './weighbridge-update-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeighbridgeUpdateReportPageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [WeighbridgeUpdateReportPage],
})
export class WeighbridgeUpdateReportPageModule {}
