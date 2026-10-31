import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceNotificationViewPage } from './maintenance-notification-view.page';

describe('MaintenanceNotificationViewPage', () => {
  let component: MaintenanceNotificationViewPage;
  let fixture: ComponentFixture<MaintenanceNotificationViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceNotificationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
