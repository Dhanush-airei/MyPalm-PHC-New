import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationViewPage } from './notification-view.page';
import { NotificationAlertPage } from '../notification-alert/notification-alert.page';
import { NotificationReminderPage } from '../notification-reminder/notification-reminder.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationViewPage,
    children: [
      {
        path: '',
        redirectTo: 'tabalerts',
        pathMatch: 'full',
      },
      {
        path: 'tabalerts',
        component: NotificationAlertPage,
      },
      {
        path: 'tabremainder',
        component: NotificationReminderPage,
      },
      {
        path: 'tabmaintenancenotification',
        component: NotificationViewPage,
      },
    ],
  },
  {
    path: 'tabalerts',
    component: NotificationAlertPage,
  },
  {
    path: 'tabremainder',
    component: NotificationReminderPage,
  },
  {
    path: 'tabmaintenancenotification',
    component: NotificationViewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationViewPageRoutingModule {}
