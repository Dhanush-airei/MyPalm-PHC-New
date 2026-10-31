import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictiveMaintenanceRejectedRecordsPage } from './predictive-maintenance-rejected-records.page';

describe('PredictiveMaintenanceRejectedRecordsPage', () => {
  let component: PredictiveMaintenanceRejectedRecordsPage;
  let fixture: ComponentFixture<PredictiveMaintenanceRejectedRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveMaintenanceRejectedRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
