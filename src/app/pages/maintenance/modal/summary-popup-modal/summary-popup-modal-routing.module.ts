import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryPopupModalPage } from './summary-popup-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SummaryPopupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryPopupModalPageRoutingModule {}
