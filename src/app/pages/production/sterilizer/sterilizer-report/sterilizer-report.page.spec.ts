import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SterilizerReportPage } from './sterilizer-report.page';

describe('SterilizerReportPage', () => {
  let component: SterilizerReportPage;
  let fixture: ComponentFixture<SterilizerReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SterilizerReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
