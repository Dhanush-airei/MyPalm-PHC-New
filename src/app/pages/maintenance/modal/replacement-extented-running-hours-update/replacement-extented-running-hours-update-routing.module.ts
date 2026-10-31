import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReplacementExtentedRunningHoursUpdatePage } from './replacement-extented-running-hours-update.page';

const routes: Routes = [
  {
    path: '',
    component: ReplacementExtentedRunningHoursUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReplacementExtentedRunningHoursUpdatePageRoutingModule {}
