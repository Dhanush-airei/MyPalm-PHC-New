import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictiveMaintenancePage } from './predictive-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: PredictiveMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictiveMaintenancePageRoutingModule {}
