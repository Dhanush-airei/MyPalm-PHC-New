import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PressReportPage } from './press-report.page';

const routes: Routes = [
  {
    path: '',
    component: PressReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PressReportPageRoutingModule {}
