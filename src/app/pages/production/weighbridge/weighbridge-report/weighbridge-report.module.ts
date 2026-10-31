import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeReportPageRoutingModule } from './weighbridge-report-routing.module';

import { WeighbridgeReportPage } from './weighbridge-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeighbridgeReportPageRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [WeighbridgeReportPage],
})
export class WeighbridgeReportPageModule {}
