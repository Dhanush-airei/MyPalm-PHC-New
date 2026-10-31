import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceMaterialSearchPagePageRoutingModule } from './maintenance-material-search-page-routing.module';

import { MaintenanceMaterialSearchPage } from './maintenance-material-search-page.page';

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
    MaintenanceMaterialSearchPagePageRoutingModule,
  ],
  declarations: [MaintenanceMaterialSearchPage],
})
export class MaintenanceMaterialSearchPagePageModule {}
