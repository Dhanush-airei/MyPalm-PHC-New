import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionProcessStatusPage } from './production-process-status.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionProcessStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionProcessStatusPageRoutingModule {}
