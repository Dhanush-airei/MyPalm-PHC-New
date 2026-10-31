import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionMachineShutdownAlertModalPage } from './production-machine-shutdown-alert-modal.page';

describe('ProductionMachineShutdownAlertModalPage', () => {
  let component: ProductionMachineShutdownAlertModalPage;
  let fixture: ComponentFixture<ProductionMachineShutdownAlertModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionMachineShutdownAlertModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
