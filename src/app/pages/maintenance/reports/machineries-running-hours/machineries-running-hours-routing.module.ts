import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MachineriesRunningHoursPage } from './machineries-running-hours.page';

const routes: Routes = [
  {
    path: '',
    component: MachineriesRunningHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MachineriesRunningHoursPageRoutingModule {}
