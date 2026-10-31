import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceMaterialSearchPage } from './maintenance-material-search-page.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceMaterialSearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceMaterialSearchPagePageRoutingModule {}
