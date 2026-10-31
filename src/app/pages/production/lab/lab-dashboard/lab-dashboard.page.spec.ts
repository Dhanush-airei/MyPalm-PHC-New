import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabDashboardPage } from './lab-dashboard.page';

describe('LabDashboardPage', () => {
  let component: LabDashboardPage;
  let fixture: ComponentFixture<LabDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
