import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyFfaQualityPage } from './daily-ffa-quality.page';

const routes: Routes = [
  {
    path: '',
    component: DailyFfaQualityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyFfaQualityPageRoutingModule {}
