import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionHourlyPressingStationUpdatePage } from './production-hourly-pressing-station-update.page';

describe('ProductionHourlyPressingStationUpdatePage', () => {
  let component: ProductionHourlyPressingStationUpdatePage;
  let fixture: ComponentFixture<ProductionHourlyPressingStationUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionHourlyPressingStationUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
