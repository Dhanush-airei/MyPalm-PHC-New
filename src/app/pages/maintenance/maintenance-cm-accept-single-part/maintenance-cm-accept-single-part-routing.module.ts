import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceCmAcceptSinglePartPage } from './maintenance-cm-accept-single-part.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceCmAcceptSinglePartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceCmAcceptSinglePartPageRoutingModule {}
