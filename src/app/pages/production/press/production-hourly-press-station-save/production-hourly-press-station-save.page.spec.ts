import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionHourlyPressStationSavePage } from './production-hourly-press-station-save.page';

describe('ProductionHourlyPressStationSavePage', () => {
  let component: ProductionHourlyPressStationSavePage;
  let fixture: ComponentFixture<ProductionHourlyPressStationSavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionHourlyPressStationSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
