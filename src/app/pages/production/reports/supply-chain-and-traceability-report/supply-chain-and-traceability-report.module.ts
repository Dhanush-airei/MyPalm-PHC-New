import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplyChainAndTraceabilityReportPageRoutingModule } from './supply-chain-and-traceability-report-routing.module';

import { SupplyChainAndTraceabilityReportPage } from './supply-chain-and-traceability-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplyChainAndTraceabilityReportPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [SupplyChainAndTraceabilityReportPage],
})
export class SupplyChainAndTraceabilityReportPageModule {}
