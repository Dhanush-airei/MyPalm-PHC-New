import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PressAlertPage } from './press-alert.page';

const routes: Routes = [
  {
    path: '',
    component: PressAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PressAlertPageRoutingModule {}
