import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiAcceptSinglePartPage } from './maintenance-ai-accept-single-part.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiAcceptSinglePartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiAcceptSinglePartPageRoutingModule {}
