import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancePreventiveMaintenanceAssignPage } from './maintenance-preventive-maintenance-assign.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenancePreventiveMaintenanceAssignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenancePreventiveMaintenanceAssignPageRoutingModule {}
