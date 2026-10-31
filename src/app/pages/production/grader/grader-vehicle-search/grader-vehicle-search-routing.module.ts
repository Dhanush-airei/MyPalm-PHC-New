import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraderVehicleSearchPage } from './grader-vehicle-search.page';

const routes: Routes = [
  {
    path: '',
    component: GraderVehicleSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraderVehicleSearchPageRoutingModule {}
