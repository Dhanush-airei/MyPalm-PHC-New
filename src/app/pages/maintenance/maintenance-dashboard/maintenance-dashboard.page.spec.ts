import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceDashboardPage } from './maintenance-dashboard.page';

describe('MaintenanceDashboardPage', () => {
  let component: MaintenanceDashboardPage;
  let fixture: ComponentFixture<MaintenanceDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
