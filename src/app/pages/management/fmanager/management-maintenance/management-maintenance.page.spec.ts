import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementMaintenancePage } from './management-maintenance.page';

describe('ManagementMaintenancePage', () => {
  let component: ManagementMaintenancePage;
  let fixture: ComponentFixture<ManagementMaintenancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
