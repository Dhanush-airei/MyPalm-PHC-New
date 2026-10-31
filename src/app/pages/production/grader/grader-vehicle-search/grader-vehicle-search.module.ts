import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraderVehicleSearchPageRoutingModule } from './grader-vehicle-search-routing.module';

import { GraderVehicleSearchPage } from './grader-vehicle-search.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    GraderVehicleSearchPageRoutingModule,
  ],
  declarations: [GraderVehicleSearchPage],
})
export class GraderVehicleSearchPageModule {}
