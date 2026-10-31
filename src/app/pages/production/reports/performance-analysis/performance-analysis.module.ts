import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgApexchartsModule } from 'ng-apexcharts';

import { PerformanceAnalysisPageRoutingModule } from './performance-analysis-routing.module';

import { PerformanceAnalysisPage } from './performance-analysis.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerformanceAnalysisPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    NgApexchartsModule,
  ],
  declarations: [PerformanceAnalysisPage],
})
export class PerformanceAnalysisPageModule {}
