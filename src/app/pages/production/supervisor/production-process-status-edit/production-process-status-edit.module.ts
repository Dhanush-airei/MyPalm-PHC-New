import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionProcessStatusEditPageRoutingModule } from './production-process-status-edit-routing.module';

import { ProductionProcessStatusEditPage } from './production-process-status-edit.page';
import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionProcessStatusEditPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [ProductionProcessStatusEditPage],
})
export class ProductionProcessStatusEditPageModule {}
