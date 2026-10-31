import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceCalendarPage } from './maintenance-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceCalendarPageRoutingModule {}
