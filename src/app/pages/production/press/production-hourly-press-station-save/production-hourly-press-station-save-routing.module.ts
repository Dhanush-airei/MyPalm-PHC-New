import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionHourlyPressStationSavePage } from './production-hourly-press-station-save.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionHourlyPressStationSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionHourlyPressStationSavePageRoutingModule {}
