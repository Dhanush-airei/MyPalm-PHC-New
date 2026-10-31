import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceUploadImagePopupPage } from './maintenance-upload-image-popup.page';

describe('MaintenanceUploadImagePopupPage', () => {
  let component: MaintenanceUploadImagePopupPage;
  let fixture: ComponentFixture<MaintenanceUploadImagePopupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceUploadImagePopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
