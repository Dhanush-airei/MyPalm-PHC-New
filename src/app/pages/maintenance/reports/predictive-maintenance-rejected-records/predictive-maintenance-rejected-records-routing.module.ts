import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictiveMaintenanceRejectedRecordsPage } from './predictive-maintenance-rejected-records.page';

const routes: Routes = [
  {
    path: '',
    component: PredictiveMaintenanceRejectedRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictiveMaintenanceRejectedRecordsPageRoutingModule {}
