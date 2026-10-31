import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerformanceAnalysisPage } from './performance-analysis.page';

const routes: Routes = [
  {
    path: '',
    component: PerformanceAnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceAnalysisPageRoutingModule {}
