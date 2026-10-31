import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceRopmTaskMultiPartSavePage } from './maintenance-ropm-task-multi-part-save.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceRopmTaskMultiPartSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRopmTaskMultiPartSavePageRoutingModule {}
