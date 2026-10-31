import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DooropenlaterUpdateModalPage } from './dooropenlater-update-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DooropenlaterUpdateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DooropenlaterUpdateModalPageRoutingModule {}
