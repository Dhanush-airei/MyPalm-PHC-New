import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OilLossesSummaryPageRoutingModule } from './oil-losses-summary-routing.module';

import { OilLossesSummaryPage } from './oil-losses-summary.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OilLossesSummaryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [OilLossesSummaryPage],
})
export class OilLossesSummaryPageModule {}
