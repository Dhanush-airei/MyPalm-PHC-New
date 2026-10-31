import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagementProductionSummaryPageRoutingModule } from './management-production-summary-routing.module';

import { ManagementProductionSummaryPage } from './management-production-summary.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagementProductionSummaryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ManagementProductionSummaryPage],
})
export class ManagementProductionSummaryPageModule {}
