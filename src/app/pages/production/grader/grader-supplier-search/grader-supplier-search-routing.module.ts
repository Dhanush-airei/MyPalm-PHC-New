import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraderSupplierSearchPage } from './grader-supplier-search.page';

const routes: Routes = [
  {
    path: '',
    component: GraderSupplierSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraderSupplierSearchPageRoutingModule {}
