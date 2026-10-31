import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceActivitySearchPage } from './maintenance-activity-search.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceActivitySearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceActivitySearchPageRoutingModule {}
