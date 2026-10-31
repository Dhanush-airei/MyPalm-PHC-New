import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeReportDashboardPage } from './weighbridge-report-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeReportDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeReportDashboardPageRoutingModule {}
