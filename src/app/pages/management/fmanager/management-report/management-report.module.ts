import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementReportPageRoutingModule } from './management-report-routing.module';

import { ManagementReportPage } from './management-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagementReportPageRoutingModule
  ],
  declarations: [ManagementReportPage]
})
export class ManagementReportPageModule {}
