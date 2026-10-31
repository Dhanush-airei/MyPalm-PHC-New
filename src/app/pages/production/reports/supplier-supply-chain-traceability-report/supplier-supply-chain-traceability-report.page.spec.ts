import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierSupplyChainTraceabilityReportPage } from './supplier-supply-chain-traceability-report.page';

describe('SupplierSupplyChainTraceabilityReportPage', () => {
  let component: SupplierSupplyChainTraceabilityReportPage;
  let fixture: ComponentFixture<SupplierSupplyChainTraceabilityReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSupplyChainTraceabilityReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
