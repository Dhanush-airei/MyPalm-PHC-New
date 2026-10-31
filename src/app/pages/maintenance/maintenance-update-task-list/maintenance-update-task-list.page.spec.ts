import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceUpdateTaskListPage } from './maintenance-update-task-list.page';

describe('MaintenanceUpdateTaskListPage', () => {
  let component: MaintenanceUpdateTaskListPage;
  let fixture: ComponentFixture<MaintenanceUpdateTaskListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceUpdateTaskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
