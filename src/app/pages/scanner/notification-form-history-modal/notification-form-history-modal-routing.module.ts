import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationFormHistoryModalPage } from './notification-form-history-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationFormHistoryModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationFormHistoryModalPageRoutingModule {}
