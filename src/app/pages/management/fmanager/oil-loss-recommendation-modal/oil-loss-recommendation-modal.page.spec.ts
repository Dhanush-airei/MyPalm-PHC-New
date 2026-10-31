import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OilLossRecommendationModalPage } from './oil-loss-recommendation-modal.page';

describe('OilLossRecommendationModalPage', () => {
  let component: OilLossRecommendationModalPage;
  let fixture: ComponentFixture<OilLossRecommendationModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OilLossRecommendationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
