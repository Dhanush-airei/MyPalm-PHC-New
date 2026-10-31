import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionMachineShutdownAlertModalPage } from './production-machine-shutdown-alert-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionMachineShutdownAlertModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionMachineShutdownAlertModalPageRoutingModule {}
