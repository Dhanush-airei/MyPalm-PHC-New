import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictiveMaintenancePage } from './predictive-maintenance.page';

describe('PredictiveMaintenancePage', () => {
  let component: PredictiveMaintenancePage;
  let fixture: ComponentFixture<PredictiveMaintenancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveMaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
