import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiViewPage } from './maintenance-ai-view.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiViewPageRoutingModule {}
