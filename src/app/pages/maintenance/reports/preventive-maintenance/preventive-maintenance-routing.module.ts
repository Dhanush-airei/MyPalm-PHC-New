import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreventiveMaintenancePage } from './preventive-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: PreventiveMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventiveMaintenancePageRoutingModule {}
