import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeUpdatePage } from './weighbridge-update.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeUpdatePageRoutingModule {}
