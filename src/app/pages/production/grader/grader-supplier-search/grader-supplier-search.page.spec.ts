import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraderSupplierSearchPage } from './grader-supplier-search.page';

describe('GraderSupplierSearchPage', () => {
  let component: GraderSupplierSearchPage;
  let fixture: ComponentFixture<GraderSupplierSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraderSupplierSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
