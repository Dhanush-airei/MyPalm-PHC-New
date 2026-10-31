import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionMachineShutdownAlertModalPageRoutingModule } from './production-machine-shutdown-alert-modal-routing.module';

import { ProductionMachineShutdownAlertModalPage } from './production-machine-shutdown-alert-modal.page';

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
    ProductionMachineShutdownAlertModalPageRoutingModule,
  ],
  declarations: [ProductionMachineShutdownAlertModalPage],
})
export class ProductionMachineShutdownAlertModalPageModule {}
