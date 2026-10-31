import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupNotificationViewPage } from './popup-notification-view.page';

const routes: Routes = [
  {
    path: '',
    component: PopupNotificationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupNotificationViewPageRoutingModule {}
