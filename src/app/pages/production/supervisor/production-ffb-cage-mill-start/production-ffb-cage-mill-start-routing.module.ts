import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionFfbCageMillStartPage } from './production-ffb-cage-mill-start.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionFfbCageMillStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionFfbCageMillStartPageRoutingModule {}
