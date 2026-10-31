import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAssignPage } from './maintenance-assign.page';

describe('MaintenanceAssignPage', () => {
  let component: MaintenanceAssignPage;
  let fixture: ComponentFixture<MaintenanceAssignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
