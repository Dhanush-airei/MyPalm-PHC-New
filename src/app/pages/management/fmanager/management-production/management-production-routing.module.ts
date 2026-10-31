import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementProductionPage } from './management-production.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementProductionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementProductionPageRoutingModule {}
