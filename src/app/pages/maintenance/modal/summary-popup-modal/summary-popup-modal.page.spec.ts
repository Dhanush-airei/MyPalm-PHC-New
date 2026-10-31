import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryPopupModalPage } from './summary-popup-modal.page';

describe('SummaryPopupModalPage', () => {
  let component: SummaryPopupModalPage;
  let fixture: ComponentFixture<SummaryPopupModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPopupModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
