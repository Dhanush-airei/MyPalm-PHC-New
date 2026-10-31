import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionBreakdownPage } from './production-breakdown.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionBreakdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionBreakdownPageRoutingModule {}
