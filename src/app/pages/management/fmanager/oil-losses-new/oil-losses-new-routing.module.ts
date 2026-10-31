import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OilLossesNewPage } from './oil-losses-new.page';

const routes: Routes = [
  {
    path: '',
    component: OilLossesNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OilLossesNewPageRoutingModule {}
