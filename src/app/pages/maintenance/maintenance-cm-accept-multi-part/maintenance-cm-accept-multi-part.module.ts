import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceCmAcceptMultiPartPageRoutingModule } from './maintenance-cm-accept-multi-part-routing.module';

import { MaintenanceCmAcceptMultiPartPage } from './maintenance-cm-accept-multi-part.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    IonicModule,
    MaintenanceCmAcceptMultiPartPageRoutingModule,
  ],
  declarations: [MaintenanceCmAcceptMultiPartPage],
})
export class MaintenanceCmAcceptMultiPartPageModule {}
