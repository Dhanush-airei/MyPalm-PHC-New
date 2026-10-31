import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeUpdatePage } from './weighbridge-update.page';

describe('WeighbridgeUpdatePage', () => {
  let component: WeighbridgeUpdatePage;
  let fixture: ComponentFixture<WeighbridgeUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighbridgeUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
