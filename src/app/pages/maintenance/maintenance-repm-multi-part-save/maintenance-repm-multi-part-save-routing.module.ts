import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceRepmMultiPartSavePage } from './maintenance-repm-multi-part-save.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceRepmMultiPartSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRepmMultiPartSavePageRoutingModule {}
