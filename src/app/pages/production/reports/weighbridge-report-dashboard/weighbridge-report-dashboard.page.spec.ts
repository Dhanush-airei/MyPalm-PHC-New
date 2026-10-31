import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeReportDashboardPage } from './weighbridge-report-dashboard.page';

describe('WeighbridgeReportDashboardPage', () => {
  let component: WeighbridgeReportDashboardPage;
  let fixture: ComponentFixture<WeighbridgeReportDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighbridgeReportDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
