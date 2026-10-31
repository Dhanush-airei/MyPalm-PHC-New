import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraderDashboardPage } from './grader-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: GraderDashboardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraderDashboardPageRoutingModule {}
