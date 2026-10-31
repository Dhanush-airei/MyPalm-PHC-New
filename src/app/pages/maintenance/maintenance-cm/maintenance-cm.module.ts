import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceCmPageRoutingModule } from './maintenance-cm-routing.module';

import { MaintenanceCmPage } from './maintenance-cm.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { FilterPipe } from 'src/app/shared/pipes/filter-pipe';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilterPipe,
    TranslateModule,
    IonicModule,
    MaintenanceCmPageRoutingModule,
  ],
  declarations: [MaintenanceCmPage],
})
export class MaintenanceCmPageModule {}
