import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SterilizerAlertPageRoutingModule } from './sterilizer-alert-routing.module';

import { SterilizerAlertPage } from './sterilizer-alert.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SterilizerAlertPageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [SterilizerAlertPage],
})
export class SterilizerAlertPageModule {}
