import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionFfbCageMillStopPage } from './production-ffb-cage-mill-stop.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionFfbCageMillStopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionFfbCageMillStopPageRoutingModule {}
