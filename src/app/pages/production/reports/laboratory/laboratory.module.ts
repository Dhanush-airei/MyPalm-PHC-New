import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaboratoryPageRoutingModule } from './laboratory-routing.module';

import { LaboratoryPage } from './laboratory.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from 'src/app/shared/safe-pipe/safe-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaboratoryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [LaboratoryPage],
})
export class LaboratoryPageModule {}
