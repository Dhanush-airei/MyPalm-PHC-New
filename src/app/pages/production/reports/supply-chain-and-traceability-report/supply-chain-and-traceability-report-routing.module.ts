import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplyChainAndTraceabilityReportPage } from './supply-chain-and-traceability-report.page';

const routes: Routes = [
  {
    path: '',
    component: SupplyChainAndTraceabilityReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplyChainAndTraceabilityReportPageRoutingModule {}
