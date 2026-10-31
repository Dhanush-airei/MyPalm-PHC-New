import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiRejectPage } from './maintenance-ai-reject.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiRejectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiRejectPageRoutingModule {}
