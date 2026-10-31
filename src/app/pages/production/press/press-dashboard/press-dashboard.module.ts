import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PressDashboardPageRoutingModule } from './press-dashboard-routing.module';

import { PressDashboardPage } from './press-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PressDashboardPageRoutingModule
  ],
  declarations: [PressDashboardPage]
})
export class PressDashboardPageModule {}
