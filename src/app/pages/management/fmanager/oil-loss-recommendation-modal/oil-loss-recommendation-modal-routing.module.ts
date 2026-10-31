import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OilLossRecommendationModalPage } from './oil-loss-recommendation-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OilLossRecommendationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OilLossRecommendationModalPageRoutingModule {}
