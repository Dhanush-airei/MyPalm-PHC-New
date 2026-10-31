import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancePreventiveMaintenanceTaskAssignPage } from './maintenance-preventive-maintenance-task-assign.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenancePreventiveMaintenanceTaskAssignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenancePreventiveMaintenanceTaskAssignPageRoutingModule {}
