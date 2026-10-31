import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionFfbCagePage } from './production-ffb-cage.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionFfbCagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionFfbCagePageRoutingModule {}
