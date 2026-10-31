import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionProcessStatusEditPage } from './production-process-status-edit.page';

describe('ProductionProcessStatusEditPage', () => {
  let component: ProductionProcessStatusEditPage;
  let fixture: ComponentFixture<ProductionProcessStatusEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionProcessStatusEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
