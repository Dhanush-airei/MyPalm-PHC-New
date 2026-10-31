import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DooropenlaterUpdateModalPageRoutingModule } from './dooropenlater-update-modal-routing.module';

import { DooropenlaterUpdateModalPage } from './dooropenlater-update-modal.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DooropenlaterUpdateModalPageRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [DooropenlaterUpdateModalPage],
})
export class DooropenlaterUpdateModalPageModule {}
