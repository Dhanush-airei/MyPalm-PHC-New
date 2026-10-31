import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionHourlySterilizerStationPage } from './production-hourly-sterilizer-station.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionHourlySterilizerStationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionHourlySterilizerStationPageRoutingModule {}
