import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiAssignPage } from './maintenance-ai-assign.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiAssignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiAssignPageRoutingModule {}
