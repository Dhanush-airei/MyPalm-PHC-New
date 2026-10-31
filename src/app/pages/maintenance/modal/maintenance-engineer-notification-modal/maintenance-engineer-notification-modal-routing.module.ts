import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceEngineerNotificationModalPage } from './maintenance-engineer-notification-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceEngineerNotificationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceEngineerNotificationModalPageRoutingModule {}
