import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionHourlyPressStationPage } from './production-hourly-press-station.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionHourlyPressStationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionHourlyPressStationPageRoutingModule {}
