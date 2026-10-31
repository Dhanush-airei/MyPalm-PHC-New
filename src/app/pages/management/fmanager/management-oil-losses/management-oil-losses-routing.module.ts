import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementOilLossesPage } from './management-oil-losses.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementOilLossesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementOilLossesPageRoutingModule {}
