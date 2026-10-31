import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeUpdateReportPage } from './weighbridge-update-report.page';

describe('WeighbridgeUpdateReportPage', () => {
  let component: WeighbridgeUpdateReportPage;
  let fixture: ComponentFixture<WeighbridgeUpdateReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighbridgeUpdateReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
