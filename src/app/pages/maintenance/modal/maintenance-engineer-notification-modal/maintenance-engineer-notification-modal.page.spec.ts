import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceEngineerNotificationModalPage } from './maintenance-engineer-notification-modal.page';

describe('MaintenanceEngineerNotificationModalPage', () => {
  let component: MaintenanceEngineerNotificationModalPage;
  let fixture: ComponentFixture<MaintenanceEngineerNotificationModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceEngineerNotificationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
