import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierSupplyChainTraceabilityReportPage } from './supplier-supply-chain-traceability-report.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierSupplyChainTraceabilityReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierSupplyChainTraceabilityReportPageRoutingModule {}
