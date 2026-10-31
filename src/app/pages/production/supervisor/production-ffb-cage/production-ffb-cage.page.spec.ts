import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionFfbCagePage } from './production-ffb-cage.page';

describe('ProductionFfbCagePage', () => {
  let component: ProductionFfbCagePage;
  let fixture: ComponentFixture<ProductionFfbCagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionFfbCagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
