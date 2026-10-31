import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceNotificationViewPage } from './maintenance-notification-view.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceNotificationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceNotificationViewPageRoutingModule {}
