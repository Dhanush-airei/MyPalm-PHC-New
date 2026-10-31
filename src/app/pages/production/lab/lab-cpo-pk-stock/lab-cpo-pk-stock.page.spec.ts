import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabCpoPkStockPage } from './lab-cpo-pk-stock.page';

describe('LabCpoPkStockPage', () => {
  let component: LabCpoPkStockPage;
  let fixture: ComponentFixture<LabCpoPkStockPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LabCpoPkStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
