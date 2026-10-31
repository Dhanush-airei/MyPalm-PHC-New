import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummaryPopupModalPageRoutingModule } from './summary-popup-modal-routing.module';

import { SummaryPopupModalPage } from './summary-popup-modal.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    IonicModule,
    SummaryPopupModalPageRoutingModule,
  ],
  declarations: [SummaryPopupModalPage],
})
export class SummaryPopupModalPageModule {}
