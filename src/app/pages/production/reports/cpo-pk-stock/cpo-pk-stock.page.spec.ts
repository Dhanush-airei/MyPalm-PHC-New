import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpoPkStockPage } from './cpo-pk-stock.page';

describe('CpoPkStockPage', () => {
  let component: CpoPkStockPage;
  let fixture: ComponentFixture<CpoPkStockPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CpoPkStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
