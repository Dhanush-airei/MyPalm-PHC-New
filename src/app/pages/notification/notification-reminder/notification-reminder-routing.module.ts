import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationReminderPage } from './notification-reminder.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationReminderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationReminderPageRoutingModule {}
