import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancePmPageRoutingModule } from './maintenance-pm-routing.module';

import { MaintenancePmPage } from './maintenance-pm.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

import { FilterPipe } from 'src/app/shared/pipes/filter-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilterPipe,
    TranslateModule,
    IonicModule,
    MaintenancePmPageRoutingModule,
  ],
  declarations: [MaintenancePmPage],
})
export class MaintenancePmPageModule {}
