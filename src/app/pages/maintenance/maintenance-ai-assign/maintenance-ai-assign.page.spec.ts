import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAiAssignPage } from './maintenance-ai-assign.page';

describe('MaintenanceAiAssignPage', () => {
  let component: MaintenanceAiAssignPage;
  let fixture: ComponentFixture<MaintenanceAiAssignPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAiAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
