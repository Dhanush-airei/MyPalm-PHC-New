import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventiveMaintenancePage } from './preventive-maintenance.page';

describe('PreventiveMaintenancePage', () => {
  let component: PreventiveMaintenancePage;
  let fixture: ComponentFixture<PreventiveMaintenancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventiveMaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
