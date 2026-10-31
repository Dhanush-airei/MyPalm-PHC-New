import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierMapScreenPage } from './supplier-map-screen.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierMapScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierMapScreenPageRoutingModule {}
