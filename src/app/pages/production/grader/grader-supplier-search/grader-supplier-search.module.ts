import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraderSupplierSearchPageRoutingModule } from './grader-supplier-search-routing.module';

import { GraderSupplierSearchPage } from './grader-supplier-search.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    GraderSupplierSearchPageRoutingModule,
  ],
  declarations: [GraderSupplierSearchPage],
})
export class GraderSupplierSearchPageModule {}
