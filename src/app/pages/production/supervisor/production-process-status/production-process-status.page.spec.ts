import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionProcessStatusPage } from './production-process-status.page';

describe('ProductionProcessStatusPage', () => {
  let component: ProductionProcessStatusPage;
  let fixture: ComponentFixture<ProductionProcessStatusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionProcessStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
