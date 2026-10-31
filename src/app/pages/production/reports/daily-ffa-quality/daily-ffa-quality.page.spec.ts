import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyFfaQualityPage } from './daily-ffa-quality.page';

describe('DailyFfaQualityPage', () => {
  let component: DailyFfaQualityPage;
  let fixture: ComponentFixture<DailyFfaQualityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyFfaQualityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
