import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierMapScreenPage } from './supplier-map-screen.page';

describe('SupplierMapScreenPage', () => {
  let component: SupplierMapScreenPage;
  let fixture: ComponentFixture<SupplierMapScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMapScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
