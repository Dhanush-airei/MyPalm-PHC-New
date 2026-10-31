import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrcodescannerPage } from './qrcodescanner.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodescannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrcodescannerPageRoutingModule {}
