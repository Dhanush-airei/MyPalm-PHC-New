import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceUpdateTaskListPage } from './maintenance-update-task-list.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceUpdateTaskListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceUpdateTaskListPageRoutingModule {}
