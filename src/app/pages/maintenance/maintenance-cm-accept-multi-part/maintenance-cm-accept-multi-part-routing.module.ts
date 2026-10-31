import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceCmAcceptMultiPartPage } from './maintenance-cm-accept-multi-part.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceCmAcceptMultiPartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceCmAcceptMultiPartPageRoutingModule {}
