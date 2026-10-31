import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OilLossesSummaryPage } from './oil-losses-summary.page';

const routes: Routes = [
  {
    path: '',
    component: OilLossesSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OilLossesSummaryPageRoutingModule {}
