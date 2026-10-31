import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraderReportPage } from './grader-report.page';

const routes: Routes = [
  {
    path: '',
    component: GraderReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraderReportPageRoutingModule {}
