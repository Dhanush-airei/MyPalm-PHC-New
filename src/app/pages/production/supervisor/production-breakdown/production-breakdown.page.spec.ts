import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionBreakdownPage } from './production-breakdown.page';

describe('ProductionBreakdownPage', () => {
  let component: ProductionBreakdownPage;
  let fixture: ComponentFixture<ProductionBreakdownPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionBreakdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
