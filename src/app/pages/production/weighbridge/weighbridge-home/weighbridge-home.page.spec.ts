import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeighbridgeHomePage } from './weighbridge-home.page';

describe('WeighbridgeHomePage', () => {
  let component: WeighbridgeHomePage;
  let fixture: ComponentFixture<WeighbridgeHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighbridgeHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
