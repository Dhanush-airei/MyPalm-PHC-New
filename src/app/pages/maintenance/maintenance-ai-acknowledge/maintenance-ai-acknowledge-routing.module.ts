import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiAcknowledgePage } from './maintenance-ai-acknowledge.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiAcknowledgePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiAcknowledgePageRoutingModule {}
