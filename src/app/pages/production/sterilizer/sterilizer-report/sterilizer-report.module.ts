import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SterilizerReportPageRoutingModule } from './sterilizer-report-routing.module';

import { SterilizerReportPage } from './sterilizer-report.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SterilizerReportPageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [SterilizerReportPage],
})
export class SterilizerReportPageModule {}
