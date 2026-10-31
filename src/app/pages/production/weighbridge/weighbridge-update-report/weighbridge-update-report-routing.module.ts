import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeUpdateReportPage } from './weighbridge-update-report.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeUpdateReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeUpdateReportPageRoutingModule {}
