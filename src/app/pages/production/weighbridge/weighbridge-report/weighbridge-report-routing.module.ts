import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeReportPage } from './weighbridge-report.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeReportPageRoutingModule {}
