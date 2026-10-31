import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartRunningHoursPage } from './part-running-hours.page';

const routes: Routes = [
  {
    path: '',
    component: PartRunningHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartRunningHoursPageRoutingModule {}
