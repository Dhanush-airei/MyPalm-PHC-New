import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrcodescannerPageRoutingModule } from './qrcodescanner-routing.module';

import { QrcodescannerPage } from './qrcodescanner.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrcodescannerPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [QrcodescannerPage],
})
export class QrcodescannerPageModule {}
