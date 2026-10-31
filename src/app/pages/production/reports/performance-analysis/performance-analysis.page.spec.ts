import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceAnalysisPage } from './performance-analysis.page';

describe('PerformanceAnalysisPage', () => {
  let component: PerformanceAnalysisPage;
  let fixture: ComponentFixture<PerformanceAnalysisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceAnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
