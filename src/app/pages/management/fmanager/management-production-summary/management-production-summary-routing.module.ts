import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementProductionSummaryPage } from './management-production-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementProductionSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementProductionSummaryPageRoutingModule {}
