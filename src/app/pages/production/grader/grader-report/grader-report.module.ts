import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraderReportPageRoutingModule } from './grader-report-routing.module';

import { GraderReportPage } from './grader-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    GraderReportPageRoutingModule,
    SharedModule,
  ],
  declarations: [GraderReportPage],
})
export class GraderReportPageModule {}
