import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraderDashboardPageRoutingModule } from './grader-dashboard-routing.module';

import { GraderDashboardPage } from './grader-dashboard.page';

import { SharedModule } from 'src/app/shared/shared-module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    GraderDashboardPageRoutingModule,
    SharedModule,
  ],
  declarations: [GraderDashboardPage],
})
export class GraderDashboardPageModule {}
