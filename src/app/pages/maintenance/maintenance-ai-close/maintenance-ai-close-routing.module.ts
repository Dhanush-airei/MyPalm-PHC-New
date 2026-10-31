import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceAiClosePage } from './maintenance-ai-close.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceAiClosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAiClosePageRoutingModule {}
