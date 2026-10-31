import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceDashboardPage } from './maintenance-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceDashboardPageRoutingModule {}
