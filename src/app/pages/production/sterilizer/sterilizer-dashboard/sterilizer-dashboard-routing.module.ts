import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SterilizerDashboardPage } from './sterilizer-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SterilizerDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SterilizerDashboardPageRoutingModule {}
