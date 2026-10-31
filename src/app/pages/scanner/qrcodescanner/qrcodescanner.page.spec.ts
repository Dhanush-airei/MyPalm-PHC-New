import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrcodescannerPage } from './qrcodescanner.page';

describe('QrcodescannerPage', () => {
  let component: QrcodescannerPage;
  let fixture: ComponentFixture<QrcodescannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodescannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
