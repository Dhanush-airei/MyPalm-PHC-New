import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplyChainAndTraceabilityReportPage } from './supply-chain-and-traceability-report.page';

describe('SupplyChainAndTraceabilityReportPage', () => {
  let component: SupplyChainAndTraceabilityReportPage;
  let fixture: ComponentFixture<SupplyChainAndTraceabilityReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainAndTraceabilityReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
