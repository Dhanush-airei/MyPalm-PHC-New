import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupplierSupplyChainTraceabilityReportPageRoutingModule } from './supplier-supply-chain-traceability-report-routing.module';

import { SupplierSupplyChainTraceabilityReportPage } from './supplier-supply-chain-traceability-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupplierSupplyChainTraceabilityReportPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [SupplierSupplyChainTraceabilityReportPage],
})
export class SupplierSupplyChainTraceabilityReportPageModule {}
