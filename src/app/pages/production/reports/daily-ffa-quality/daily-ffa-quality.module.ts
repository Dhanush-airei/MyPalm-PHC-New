import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyFfaQualityPageRoutingModule } from './daily-ffa-quality-routing.module';

import { DailyFfaQualityPage } from './daily-ffa-quality.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyFfaQualityPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [DailyFfaQualityPage],
})
export class DailyFfaQualityPageModule {}
