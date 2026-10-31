import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressReportPage } from './press-report.page';

describe('PressReportPage', () => {
  let component: PressReportPage;
  let fixture: ComponentFixture<PressReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PressReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
