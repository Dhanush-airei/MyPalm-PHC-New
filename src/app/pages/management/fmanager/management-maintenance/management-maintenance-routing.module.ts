import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementMaintenancePage } from './management-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementMaintenancePageRoutingModule {}
