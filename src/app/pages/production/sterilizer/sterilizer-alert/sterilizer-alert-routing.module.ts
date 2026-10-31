import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SterilizerAlertPage } from './sterilizer-alert.page';

const routes: Routes = [
  {
    path: '',
    component: SterilizerAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SterilizerAlertPageRoutingModule {}
