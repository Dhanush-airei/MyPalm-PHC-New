import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancePreventiveMaintenanceTaskAssignPage } from './maintenance-preventive-maintenance-task-assign.page';

describe('MaintenancePreventiveMaintenanceTaskAssignPage', () => {
  let component: MaintenancePreventiveMaintenanceTaskAssignPage;
  let fixture: ComponentFixture<MaintenancePreventiveMaintenanceTaskAssignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePreventiveMaintenanceTaskAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
