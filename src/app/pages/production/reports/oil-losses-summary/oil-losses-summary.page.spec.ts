import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OilLossesSummaryPage } from './oil-losses-summary.page';

describe('OilLossesSummaryPage', () => {
  let component: OilLossesSummaryPage;
  let fixture: ComponentFixture<OilLossesSummaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OilLossesSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
