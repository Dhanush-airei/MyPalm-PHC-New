import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertAcknowledgePage } from './alert-acknowledge.page';

const routes: Routes = [
  {
    path: '',
    component: AlertAcknowledgePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertAcknowledgePageRoutingModule {}
