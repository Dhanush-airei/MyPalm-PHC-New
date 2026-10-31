import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PressDashboardPage } from './press-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: PressDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PressDashboardPageRoutingModule {}
