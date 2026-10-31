import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabCpoPkStockPage } from './lab-cpo-pk-stock.page';

const routes: Routes = [
  {
    path: '',
    component: LabCpoPkStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabCpoPkStockPageRoutingModule {}
