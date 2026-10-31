import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiPage } from './maintenance-ai.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiPageRoutingModule {}
