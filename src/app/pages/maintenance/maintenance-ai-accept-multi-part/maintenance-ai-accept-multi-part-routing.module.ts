import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiAcceptMultiPartPage } from './maintenance-ai-accept-multi-part.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiAcceptMultiPartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiAcceptMultiPartPageRoutingModule {}
