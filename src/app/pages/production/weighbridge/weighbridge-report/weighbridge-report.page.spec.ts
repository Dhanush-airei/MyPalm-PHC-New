import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeReportPage } from './weighbridge-report.page';

describe('WeighbridgeReportPage', () => {
  let component: WeighbridgeReportPage;
  let fixture: ComponentFixture<WeighbridgeReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighbridgeReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
