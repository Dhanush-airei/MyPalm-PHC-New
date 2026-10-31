import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationTimelineModalPage } from './notification-timeline-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationTimelineModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationTimelineModalPageRoutingModule {}
