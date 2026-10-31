import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeHomePage } from './weighbridge-home.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeHomePageRoutingModule {}
