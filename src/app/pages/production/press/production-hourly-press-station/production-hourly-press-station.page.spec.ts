import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionHourlyPressStationPage } from './production-hourly-press-station.page';

describe('ProductionHourlyPressStationPage', () => {
  let component: ProductionHourlyPressStationPage;
  let fixture: ComponentFixture<ProductionHourlyPressStationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionHourlyPressStationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
