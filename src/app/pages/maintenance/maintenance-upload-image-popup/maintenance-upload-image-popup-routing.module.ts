import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceUploadImagePopupPage } from './maintenance-upload-image-popup.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceUploadImagePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceUploadImagePopupPageRoutingModule {}
