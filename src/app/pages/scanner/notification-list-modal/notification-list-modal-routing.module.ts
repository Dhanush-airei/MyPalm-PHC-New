import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationListModalPage } from './notification-list-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationListModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationListModalPageRoutingModule {}
