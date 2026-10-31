import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceCmPage } from './maintenance-cm.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceCmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceCmPageRoutingModule {}
