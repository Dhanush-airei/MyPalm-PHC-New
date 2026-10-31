import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancePmPage } from './maintenance-pm.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenancePmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenancePmPageRoutingModule {}
