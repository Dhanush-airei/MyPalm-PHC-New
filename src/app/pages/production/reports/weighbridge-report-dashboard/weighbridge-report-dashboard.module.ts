import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeReportDashboardPageRoutingModule } from './weighbridge-report-dashboard-routing.module';
import { WeighbridgeReportDashboardPage } from './weighbridge-report-dashboard.page';

import { SharedModule } from 'src/app/shared/shared-module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from 'src/app/shared/safe-pipe/safe-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeighbridgeReportDashboardPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [WeighbridgeReportDashboardPage],
})
export class WeighbridgeReportDashboardPageModule {}
