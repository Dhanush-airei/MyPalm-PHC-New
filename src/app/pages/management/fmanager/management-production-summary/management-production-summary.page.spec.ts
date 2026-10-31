import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementProductionSummaryPage } from './management-production-summary.page';

describe('ManagementProductionSummaryPage', () => {
  let component: ManagementProductionSummaryPage;
  let fixture: ComponentFixture<ManagementProductionSummaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementProductionSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
