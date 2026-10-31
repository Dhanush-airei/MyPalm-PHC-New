import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancePreventiveMaintenanceAssignPage } from './maintenance-preventive-maintenance-assign.page';

describe('MaintenancePreventiveMaintenanceAssignPage', () => {
  let component: MaintenancePreventiveMaintenanceAssignPage;
  let fixture: ComponentFixture<MaintenancePreventiveMaintenanceAssignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePreventiveMaintenanceAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
