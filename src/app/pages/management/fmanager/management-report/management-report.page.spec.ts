import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementReportPage } from './management-report.page';

describe('ManagementReportPage', () => {
  let component: ManagementReportPage;
  let fixture: ComponentFixture<ManagementReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
