import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancePmPage } from './maintenance-pm.page';

describe('MaintenancePmPage', () => {
  let component: MaintenancePmPage;
  let fixture: ComponentFixture<MaintenancePmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
