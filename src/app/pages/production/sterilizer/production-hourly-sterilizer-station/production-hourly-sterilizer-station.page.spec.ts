import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionHourlySterilizerStationPage } from './production-hourly-sterilizer-station.page';

describe('ProductionHourlySterilizerStationPage', () => {
  let component: ProductionHourlySterilizerStationPage;
  let fixture: ComponentFixture<ProductionHourlySterilizerStationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionHourlySterilizerStationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
