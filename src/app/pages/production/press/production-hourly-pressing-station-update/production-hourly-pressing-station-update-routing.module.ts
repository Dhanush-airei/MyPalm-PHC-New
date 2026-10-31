import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionHourlyPressingStationUpdatePage } from './production-hourly-pressing-station-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionHourlyPressingStationUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionHourlyPressingStationUpdatePageRoutingModule {}
