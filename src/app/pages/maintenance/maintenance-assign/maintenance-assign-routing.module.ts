import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAssignPage } from './maintenance-assign.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAssignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAssignPageRoutingModule {}
