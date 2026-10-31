import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionProcessStatusEditPage } from './production-process-status-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionProcessStatusEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionProcessStatusEditPageRoutingModule {}
