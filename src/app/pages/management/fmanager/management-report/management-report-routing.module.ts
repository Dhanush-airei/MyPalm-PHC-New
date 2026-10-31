import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementReportPage } from './management-report.page';

const routes: Routes = [
  {
    path: '',
    component: ManagementReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementReportPageRoutingModule {}
