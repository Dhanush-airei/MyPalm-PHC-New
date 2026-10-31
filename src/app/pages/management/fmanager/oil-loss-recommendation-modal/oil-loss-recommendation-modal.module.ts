import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OilLossRecommendationModalPageRoutingModule } from './oil-loss-recommendation-modal-routing.module';

import { OilLossRecommendationModalPage } from './oil-loss-recommendation-modal.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OilLossRecommendationModalPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [OilLossRecommendationModalPage],
})
export class OilLossRecommendationModalPageModule {}
