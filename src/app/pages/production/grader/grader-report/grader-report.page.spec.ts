import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraderReportPage } from './grader-report.page';

describe('GraderReportPage', () => {
  let component: GraderReportPage;
  let fixture: ComponentFixture<GraderReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraderReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
